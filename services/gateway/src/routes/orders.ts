import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { db } from '../db/client.js'
import { generateId } from '../lib/id.js'
import { createApiError } from '../middleware/errorHandler.js'
import type { NextFunction, Request, Response } from 'express'

const router: RouterType = Router()

router.get('/', (_req: Request, res: Response) => {
  res.json(db.orders)
})

const createOrderSchema = z.object({
  spotId: z.string().default(''),
  merchantId: z.string().default(''),
  merchantName: z.string().default(''),
  serviceType: z.enum(['concierge', 'guide', 'business-dining', 'photo']),
  language: z.string().default('en'),
  guests: z.number().int().min(1).max(20),
  date: z.string(),
  time: z.string(),
  amount: z.number().positive(),
})

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createOrderSchema.parse(req.body)
    const orderId = generateId('ORD')
    const now = new Date().toISOString()

    const order = db.createOrder({
      orderId,
      ...body,
      status: 'pending_payment',
      stripePaymentIntentId: null,
      createdAt: now,
      updatedAt: null,
    })

    res.status(201).json({ orderId: order.orderId, status: order.status, amount: order.amount, createdAt: order.createdAt })
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
    } else {
      next(e)
    }
  }
})

router.get('/:id', (req: Request, res: Response) => {
  const order = db.findOrder(req.params['id'] as string)
  if (!order) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } })
    return
  }
  res.json(order)
})

export default router

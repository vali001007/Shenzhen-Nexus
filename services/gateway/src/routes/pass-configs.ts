import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { db } from '../db/client.js'
import { createApiError } from '../middleware/errorHandler.js'
import type { Request, Response, NextFunction } from 'express'

const router: RouterType = Router()

const passConfigSchema = z.object({
  spotId: z.string().min(1),
  merchantId: z.string().min(1),
  enabled: z.boolean().default(true),
  quota: z.number().int().min(1).max(100000).default(100),
  expiresHours: z.number().int().min(1).max(720).default(72),
  note: z.string().max(200).optional(),
})

router.get('/', (_req: Request, res: Response) => {
  res.json(db.listPassConfigs())
})

router.put('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = passConfigSchema.parse(req.body)
    const spot = db.findSpot(body.spotId)
    if (!spot) throw createApiError(404, 'SPOT_NOT_FOUND', 'Spot not found')

    const merchant = db.findMerchant(body.merchantId)
    if (!merchant) throw createApiError(404, 'MERCHANT_NOT_FOUND', 'Merchant not found')

    const saved = db.upsertPassConfig({
      ...body,
      updatedAt: new Date().toISOString(),
    })

    res.json(saved)
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
      return
    }
    next(e)
  }
})

export default router

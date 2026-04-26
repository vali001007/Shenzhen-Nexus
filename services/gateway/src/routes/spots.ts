import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { db } from '../db/client.js'
import { createApiError } from '../middleware/errorHandler.js'
import type { Request, Response, NextFunction } from 'express'

const router: RouterType = Router()

const spotSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  rank: z.string().min(1),
  title: z.object({ en: z.string().min(1), zh: z.string().min(1) }),
  subtitle: z.object({ en: z.string().min(1), zh: z.string().min(1) }),
  description: z.object({ en: z.string().optional(), zh: z.string().optional() }).optional(),
  sceneFit: z.object({ en: z.string().optional(), zh: z.string().optional() }).optional(),
  image: z.string().optional(),
})

const merchantSchema = z.object({
  merchantId: z.string().min(1),
  spotId: z.string().min(1),
  name: z.object({ en: z.string().min(1), zh: z.string().min(1) }),
  distance: z.object({ en: z.string().min(1), zh: z.string().min(1) }),
  reason: z.object({ en: z.string().min(1), zh: z.string().min(1) }),
  tags: z.array(z.object({ en: z.string().min(1), zh: z.string().min(1) })).default([]),
  status: z.enum(['available', 'paused']).default('available'),
  weight: z.number().min(0).max(100).default(50),
  sortOrder: z.number().int().min(0).max(9999).default(100),
})

router.get('/', (req, res) => {
  const category = req.query.category as string | undefined
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 6))
  const offset = (page - 1) * pageSize

  let items = db.spots
  if (category && category !== 'all') {
    items = items.filter((s) => s.category === category)
  }

  const total = items.length
  const paged = items.slice(offset, offset + pageSize)

  const result = paged.map((spot) => ({
    ...spot,
    merchants: db.findMerchantsBySpot(spot.id)
      .sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100) || (b.weight ?? 50) - (a.weight ?? 50)),
  }))

  res.json({ items: result, total, page, pageSize, hasMore: offset + pageSize < total })
})

router.get('/:id', (req, res) => {
  const spot = db.findSpot(req.params.id)
  if (!spot) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Spot not found' } })
    return
  }

  const merchants = db.findMerchantsBySpot(spot.id)
    .sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100) || (b.weight ?? 50) - (a.weight ?? 50))
  res.json({ ...spot, merchants })
})

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = spotSchema.parse(req.body)
    if (db.findSpot(body.id)) {
      throw createApiError(409, 'SPOT_EXISTS', 'Spot id already exists')
    }
    const spot = db.createSpot(body)
    res.status(201).json(spot)
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
      return
    }
    next(e)
  }
})

router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = db.findSpot(req.params['id'] as string)
    if (!existing) throw createApiError(404, 'NOT_FOUND', 'Spot not found')

    const parsed = spotSchema.partial().parse(req.body)
    const updated = db.updateSpot(req.params['id'] as string, parsed)
    res.json(updated)
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
      return
    }
    next(e)
  }
})

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const ok = db.deleteSpot(req.params['id'] as string)
    if (!ok) throw createApiError(404, 'NOT_FOUND', 'Spot not found')
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
})

router.post('/merchants', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = merchantSchema.parse(req.body)
    if (!db.findSpot(body.spotId)) throw createApiError(404, 'SPOT_NOT_FOUND', 'Spot not found')
    if (db.findMerchant(body.merchantId)) throw createApiError(409, 'MERCHANT_EXISTS', 'Merchant id already exists')

    const merchant = db.createMerchant(body)
    res.status(201).json(merchant)
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
      return
    }
    next(e)
  }
})

router.patch('/merchants/:merchantId', (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = db.findMerchant(req.params['merchantId'] as string)
    if (!existing) throw createApiError(404, 'NOT_FOUND', 'Merchant not found')

    const parsed = merchantSchema.partial().parse(req.body)
    if (parsed.spotId && !db.findSpot(parsed.spotId)) {
      throw createApiError(404, 'SPOT_NOT_FOUND', 'Target spot not found')
    }

    const updated = db.updateMerchant(req.params['merchantId'] as string, parsed)
    res.json(updated)
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
      return
    }
    next(e)
  }
})

router.delete('/merchants/:merchantId', (req: Request, res: Response, next: NextFunction) => {
  try {
    const ok = db.deleteMerchant(req.params['merchantId'] as string)
    if (!ok) throw createApiError(404, 'NOT_FOUND', 'Merchant not found')
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
})

export default router

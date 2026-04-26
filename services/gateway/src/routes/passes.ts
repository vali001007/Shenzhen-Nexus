import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { db } from '../db/client.js'
import { generateId } from '../lib/id.js'
import { signPass, verifyPassHmac } from '../lib/hmac.js'
import { createApiError } from '../middleware/errorHandler.js'
import type { Request, Response, NextFunction } from 'express'

const router: RouterType = Router()

router.get('/', (_req: Request, res: Response) => {
  res.json(db.passes)
})

const claimSchema = z.object({
  spotId: z.string().min(1),
  merchantId: z.string().min(1),
  merchantName: z.string().min(1),
  source: z.string().default('fusion_overlay'),
})

router.post('/claim', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = claimSchema.parse(req.body)

    const existing = db.findActivePass(body.spotId, body.merchantId)
    if (existing) {
      res.status(409).json({ error: { code: 'PASS_EXISTS', message: 'Active pass already exists' }, passId: existing.passId })
      return
    }

    const passId = generateId('PASS')
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString()
    const claimedAt = now.toISOString()
    const hmac = signPass(passId, body.spotId, body.merchantId, expiresAt)
    const qrPayload = JSON.stringify({ passId, spotId: body.spotId, merchantId: body.merchantId, exp: expiresAt, hmac })

    db.createPass({ passId, ...body, status: 'active', claimedAt, expiresAt, hmacSignature: hmac })

    res.status(201).json({ passId, spotId: body.spotId, merchantId: body.merchantId, merchantName: body.merchantName, claimedAt, expiresAt, qrPayload, hmac })
  } catch (e: any) {
    if (e.name === 'ZodError') {
      next(createApiError(400, 'VALIDATION_ERROR', e.errors.map((x: any) => `${x.path}: ${x.message}`).join('; ')))
    } else {
      next(e)
    }
  }
})

router.get('/:id', (req: Request, res: Response) => {
  const pass = db.findPass(req.params['id'] as string)
  if (!pass) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Pass not found' } })
    return
  }
  const { hmacSignature, ...safe } = pass
  res.json(safe)
})

router.post('/:id/redeem', (req: Request, res: Response, next: NextFunction) => {
  try {
    const passId = req.params['id'] as string
    const { merchantId, hmac } = req.body

    if (!merchantId || !hmac) throw createApiError(400, 'MISSING_FIELDS', 'merchantId and hmac are required')

    const pass = db.findPass(passId)
    if (!pass) throw createApiError(404, 'PASS_NOT_FOUND', 'Pass not found')
    if (pass.status === 'redeemed') throw createApiError(409, 'ALREADY_REDEEMED', 'Pass already redeemed')
    if (new Date(pass.expiresAt) < new Date()) throw createApiError(410, 'PASS_EXPIRED', 'Pass has expired')

    const validHmac = verifyPassHmac(passId, pass.spotId, pass.merchantId, pass.expiresAt, hmac)
    if (!validHmac) throw createApiError(403, 'INVALID_SIGNATURE', 'HMAC verification failed')
    if (pass.merchantId !== merchantId) throw createApiError(403, 'MERCHANT_MISMATCH', 'Pass is not for this merchant')

    const existingRedemption = db.findRedemptionByPass(passId)
    if (existingRedemption) throw createApiError(409, 'ALREADY_REDEEMED', 'Pass already redeemed')

    const redemptionId = generateId('RDM')
    const redeemedAt = new Date().toISOString()

    db.updatePass(passId, { status: 'redeemed' })
    db.createRedemption({ redemptionId, passId, merchantId, redeemedAt })

    res.json({ redemptionId, passId, merchantId, redeemedAt })
  } catch (e) {
    next(e)
  }
})

export default router

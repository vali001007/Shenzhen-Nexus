import { Router, type Router as RouterType } from 'express'
import { db } from '../db/client.js'
import { stripe } from '../lib/stripe.js'
import { config } from '../config.js'
import { createApiError } from '../middleware/errorHandler.js'
import type { Request, Response, NextFunction } from 'express'

const router: RouterType = Router()

router.post('/create-intent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body
    if (!orderId) throw createApiError(400, 'MISSING_ORDER_ID', 'orderId is required')

    const order = db.findOrder(orderId)
    if (!order) throw createApiError(404, 'ORDER_NOT_FOUND', 'Order not found')
    if (order.status !== 'pending_payment') throw createApiError(400, 'INVALID_STATUS', `Order status is ${order.status}`)

    if (order.stripePaymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId)
      res.json({ clientSecret: existing.client_secret, paymentIntentId: existing.id })
      return
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100),
      currency: 'cny',
      metadata: { orderId: order.orderId, spotId: order.spotId, merchantId: order.merchantId },
    })

    db.updateOrder(orderId, { stripePaymentIntentId: paymentIntent.id, updatedAt: new Date().toISOString() })

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })
  } catch (e) {
    next(e)
  }
})

router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string
    if (!sig) throw createApiError(400, 'MISSING_SIGNATURE', 'Missing stripe-signature header')

    const event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret)

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as any
      const orderId = pi.metadata?.orderId
      if (orderId) {
        const order = db.findOrder(orderId)
        if (order && order.status === 'pending_payment') {
          db.updateOrder(orderId, { status: 'paid', updatedAt: new Date().toISOString() })
        }
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as any
      const orderId = pi.metadata?.orderId
      if (orderId) {
        const order = db.findOrder(orderId)
        if (order && order.status === 'pending_payment') {
          db.updateOrder(orderId, { status: 'failed', updatedAt: new Date().toISOString() })
        }
      }
    }

    res.json({ received: true })
  } catch (e) {
    next(e)
  }
})

router.post('/:id/refund', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params['id'] as string
    const order = db.findOrder(orderId)
    if (!order) throw createApiError(404, 'ORDER_NOT_FOUND', 'Order not found')
    if (order.status !== 'paid') throw createApiError(400, 'INVALID_STATUS', `Cannot refund order with status ${order.status}`)
    if (!order.stripePaymentIntentId) throw createApiError(400, 'NO_PAYMENT_INTENT', 'No payment intent associated with this order')

    const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId)
    const chargeId = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id
    if (!chargeId) throw createApiError(400, 'NO_CHARGE', 'No charge found for this payment intent')

    const refund = await stripe.refunds.create({ charge: chargeId })
    db.updateOrder(orderId, { status: 'refunded', stripeRefundId: refund.id, updatedAt: new Date().toISOString() })

    res.json({ refundId: refund.id, status: refund.status })
  } catch (e) {
    next(e)
  }
})

export default router

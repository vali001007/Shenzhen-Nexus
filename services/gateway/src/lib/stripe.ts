import Stripe from 'stripe'
import { config } from '../config.js'

let _instance: Stripe | null = null

export function getStripe(): Stripe {
  if (!_instance) {
    if (!config.stripeSecretKey) throw new Error('STRIPE_SECRET_KEY is not configured')
    _instance = new Stripe(config.stripeSecretKey)
  }
  return _instance
}

import crypto from 'node:crypto'
import { config } from '../config.js'

export function signPass(passId: string, spotId: string, merchantId: string, expiresAt: string): string {
  const data = `${passId}|${spotId}|${merchantId}|${expiresAt}`
  return crypto.createHmac('sha256', config.passHmacSecret).update(data).digest('hex')
}

export function verifyPassHmac(passId: string, spotId: string, merchantId: string, expiresAt: string, hmac: string): boolean {
  const expected = signPass(passId, spotId, merchantId, expiresAt)
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac))
}

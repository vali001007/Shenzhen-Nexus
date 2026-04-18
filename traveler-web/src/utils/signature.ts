export function computeSignature(payload: {
  orderId?: string
  paymentIntentId?: string
  status?: string
}): string {
  const signingRaw = `${payload.orderId || ''}|${payload.paymentIntentId || ''}|${payload.status || ''}|SNX_APEC_PAYMENT_SECRET`
  return btoa(unescape(encodeURIComponent(signingRaw))).slice(0, 24)
}

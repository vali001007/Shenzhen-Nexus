import 'dotenv/config'

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  passHmacSecret: process.env.PASS_HMAC_SECRET || 'dev-hmac-secret',
  appEnv: process.env.APP_ENV || process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  metricsWarnMs: parseNumber(process.env.METRICS_WARN_MS, 800),
  metricsSlowMs: parseNumber(process.env.METRICS_SLOW_MS, 1500),
}

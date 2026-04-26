import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config.js'
import { errorHandler } from './middleware/errorHandler.js'
import { optionalAuth } from './middleware/auth.js'
import { getMetricsSnapshot, requestMetrics } from './middleware/metrics.js'
import spotsRouter from './routes/spots.js'
import ordersRouter from './routes/orders.js'
import paymentsRouter from './routes/payments.js'
import passesRouter from './routes/passes.js'
import passConfigsRouter from './routes/pass-configs.js'
import aiRouter from './routes/ai.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(requestMetrics)

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }))

app.use(express.json())
app.use(optionalAuth)

app.use('/api/spots', spotsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/passes', passesRouter)
app.use('/api/pass-configs', passConfigsRouter)
app.use('/api/ai', aiRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: config.appEnv, logLevel: config.logLevel, timestamp: new Date().toISOString() })
})

app.get('/api/metrics', (_req, res) => {
  res.json(getMetricsSnapshot())
})

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`[gateway] listening on http://localhost:${config.port}`)
})

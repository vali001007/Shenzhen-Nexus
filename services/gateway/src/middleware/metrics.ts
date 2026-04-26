import type { NextFunction, Request, Response } from 'express'
import { config } from '../config.js'

interface MetricItem {
  method: string
  route: string
  statusCode: number
  durationMs: number
  level: 'ok' | 'warn' | 'slow'
  timestamp: string
}

const items: MetricItem[] = []
const METRICS_CAP = 500

function resolveLevel(durationMs: number): MetricItem['level'] {
  if (durationMs >= config.metricsSlowMs) return 'slow'
  if (durationMs >= config.metricsWarnMs) return 'warn'
  return 'ok'
}

function pushMetric(item: MetricItem) {
  items.unshift(item)
  if (items.length > METRICS_CAP) {
    items.length = METRICS_CAP
  }
}

export function requestMetrics(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1_000_000
    const level = resolveLevel(durationMs)
    const route = req.originalUrl || req.url

    const metric: MetricItem = {
      method: req.method,
      route,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      level,
      timestamp: new Date().toISOString(),
    }

    pushMetric(metric)

    if (level !== 'ok') {
      const threshold = level === 'slow' ? config.metricsSlowMs : config.metricsWarnMs
      console.warn(
        `[PERF] level=${level} method=${metric.method} route=${metric.route} status=${metric.statusCode} durationMs=${metric.durationMs} thresholdMs=${threshold}`,
      )
    }
  })

  next()
}

export function getMetricsSnapshot() {
  const total = items.length
  if (total === 0) {
    return {
      summary: {
        total: 0,
        avgMs: 0,
        warnCount: 0,
        slowCount: 0,
        warnThresholdMs: config.metricsWarnMs,
        slowThresholdMs: config.metricsSlowMs,
      },
      items,
    }
  }

  const sum = items.reduce((acc, cur) => acc + cur.durationMs, 0)
  const warnCount = items.filter((x) => x.level === 'warn').length
  const slowCount = items.filter((x) => x.level === 'slow').length

  return {
    summary: {
      total,
      avgMs: Number((sum / total).toFixed(2)),
      warnCount,
      slowCount,
      warnThresholdMs: config.metricsWarnMs,
      slowThresholdMs: config.metricsSlowMs,
    },
    items,
  }
}

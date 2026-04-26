import { Router, type Router as RouterType } from 'express'
import { createApiError } from '../middleware/errorHandler.js'
import { db } from '../db/client.js'
import { generateId } from '../lib/id.js'
import type { Request, Response, NextFunction } from 'express'

const router: RouterType = Router()

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.with7.cn'
const AI_API_KEY = process.env.AI_API_KEY || ''
const MODEL = process.env.AI_MODEL || 'claude-haiku-4-5-20251001'

const knowledgeBase = {
  city: 'Shenzhen is a modern coastal metropolis in southern China and core city of the Guangdong-Hong Kong-Macao Greater Bay Area.',
  transport: 'Primary urban transport includes metro, taxi, ride-hailing, and selected autonomous driving pilot zones.',
  payment: 'Common payment options for international visitors include international cards and local wallets where supported by merchants.',
  apec: 'For APEC-style business visitors, recommendations should prioritize bilingual service, card acceptance, reliability, and travel efficiency.',
}

const promptTemplates = {
  chat: 'You are an expert local guide in Shenzhen curating practical experiences for foreign APEC visitors.',
  plan: 'You are a professional Shenzhen itinerary planner. Return practical, time-aware plans.',
  vision: 'You are an expert Shenzhen cultural assistant. Analyze visual input and output structured JSON only.',
}

function buildSystemPrompt(kind: keyof typeof promptTemplates, lang?: string) {
  const langInstruction = lang === 'zh'
    ? 'IMPORTANT: YOU MUST RESPOND ENTIRELY IN SIMPLIFIED CHINESE (简体中文), except proper nouns and requested original names.'
    : 'Respond in clear English unless user asks another language.'

  const kb = `Knowledge base:\n- ${knowledgeBase.city}\n- ${knowledgeBase.transport}\n- ${knowledgeBase.payment}\n- ${knowledgeBase.apec}`

  return `${promptTemplates[kind]}\n\n${kb}\n\n${langInstruction}`
}

async function callClaude(system: string, userContent: any, maxTokens = 2048) {
  if (!AI_API_KEY) throw createApiError(503, 'AI_UNAVAILABLE', 'AI service not configured')

  const response = await fetch(`${AI_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      system,
      messages: [{ role: 'user', content: userContent }],
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw createApiError(502, 'AI_UPSTREAM_ERROR', `Upstream AI error ${response.status}: ${body}`)
  }

  const data = await response.json() as any
  const text: string = data?.content?.[0]?.text
  if (!text) throw createApiError(502, 'AI_EMPTY_RESPONSE', 'Empty response from AI')
  return text
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
}

function logAiRequest(kind: 'chat' | 'plan' | 'vision', ok: boolean, startedAt: number, errorCode?: string) {
  db.logAiEvent({
    id: generateId('AILOG'),
    kind,
    ok,
    latencyMs: Date.now() - startedAt,
    model: MODEL,
    errorCode: errorCode || null,
    createdAt: new Date().toISOString(),
  })
}

router.get('/logs', (_req: Request, res: Response) => {
  const logs = db.aiLogs.slice(0, 200)
  const total = logs.length
  const success = logs.filter((l) => l.ok).length
  const failed = total - success
  const avgLatencyMs = total ? Math.round(logs.reduce((sum, l) => sum + (l.latencyMs || 0), 0) / total) : 0

  res.json({
    summary: {
      total,
      success,
      failed,
      successRate: total ? Number(((success / total) * 100).toFixed(1)) : 0,
      avgLatencyMs,
    },
    items: logs,
  })
})

// POST /api/ai/chat
router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now()
  try {
    const { prompt, lang } = req.body
    if (!prompt || typeof prompt !== 'string') throw createApiError(400, 'MISSING_PROMPT', 'prompt is required')

    const system = buildSystemPrompt('chat', lang)
    const text = await callClaude(system, prompt)
    logAiRequest('chat', true, startedAt)
    res.json({ text })
  } catch (e: any) {
    logAiRequest('chat', false, startedAt, e?.code || 'UNKNOWN')
    next(e)
  }
})

// POST /api/ai/plan
router.post('/plan', async (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now()
  try {
    const { prompt, lang } = req.body
    if (!prompt || typeof prompt !== 'string') throw createApiError(400, 'MISSING_PROMPT', 'prompt is required')

    const system = buildSystemPrompt('plan', lang)
    const text = await callClaude(system, prompt, 2048)
    const result = JSON.parse(stripFences(text))
    logAiRequest('plan', true, startedAt)
    res.json(result)
  } catch (e: any) {
    logAiRequest('plan', false, startedAt, e?.code || 'UNKNOWN')
    next(e)
  }
})

// POST /api/ai/vision
router.post('/vision', async (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now()
  try {
    const { base64Data, mimeType, lang } = req.body
    if (!base64Data || !mimeType) throw createApiError(400, 'MISSING_IMAGE', 'base64Data and mimeType are required')

    const system = `${buildSystemPrompt('vision', lang)} Analyze the image and return ONLY valid JSON (no markdown) with fields: term, pinyin, translation, context, tags (array).`
    const userContent = [
      { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
      { type: 'text', text: 'Analyze this image and return the structured JSON.' },
    ]

    const text = await callClaude(system, userContent, 1024)
    const parsed = JSON.parse(stripFences(text))
    if (!parsed.term || !parsed.translation) throw createApiError(502, 'AI_INCOMPLETE', 'Incomplete response structure')
    logAiRequest('vision', true, startedAt)
    res.json(parsed)
  } catch (e: any) {
    logAiRequest('vision', false, startedAt, e?.code || 'UNKNOWN')
    next(e)
  }
})

export default router

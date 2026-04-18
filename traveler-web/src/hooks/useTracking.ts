import { useAppStore } from '../stores/useAppStore'
import { EVENT_REQUIRED_FIELDS } from '../data/events'
import type { EventPayload } from '../data/types'

export function validateEventPayload(eventName: string, payload: Record<string, unknown>): boolean {
  const required = EVENT_REQUIRED_FIELDS[eventName]
  if (!required) return true
  return required.every((field) => payload[field] !== undefined && payload[field] !== null)
}

export function trackEvent(eventName: string, data: Record<string, unknown> = {}) {
  const { sessionId, addEvent } = useAppStore.getState()
  const payload: EventPayload = {
    eventName,
    timestamp: new Date().toISOString(),
    sessionId,
    ...data,
  }

  if (!validateEventPayload(eventName, payload)) {
    console.warn(`[SNX][EVENT] Missing required fields for ${eventName}`, payload)
  }

  addEvent(payload)
  console.info('[SNX][EVENT]', payload)
}

export function logOperational(scope: string, data: Record<string, unknown> = {}) {
  console.info('[SNX][LOG]', {
    scope,
    timestamp: new Date().toISOString(),
    ...data,
  })
}

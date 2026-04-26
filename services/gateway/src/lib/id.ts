let counter = 0

export function generateId(prefix: string): string {
  const ts = Date.now()
  const rand = (++counter * 2654435761 >>> 0).toString(36).slice(0, 6).padStart(6, '0')
  return `${prefix}-${ts}-${rand}`
}

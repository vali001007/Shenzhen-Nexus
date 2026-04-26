import type { Request, Response, NextFunction } from 'express'

interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500
  const code = err.code || 'INTERNAL_ERROR'
  console.error(`[ERROR] ${statusCode} ${code}:`, err.message)
  res.status(statusCode).json({ error: { code, message: err.message } })
}

export function createApiError(statusCode: number, code: string, message: string): ApiError {
  const err = new Error(message) as ApiError
  err.statusCode = statusCode
  err.code = code
  return err
}

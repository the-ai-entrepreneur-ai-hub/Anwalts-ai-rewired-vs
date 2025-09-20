export interface HttpError extends Error {
  status: number
  requiresAuth?: boolean
  fieldErrors?: Record<string, string[]>
  data?: unknown
}

export function createHttpError(status: number, message: string, extras: Partial<HttpError> = {}): HttpError {
  const error = new Error(message) as HttpError
  error.status = status
  if (status === 401) {
    extras.requiresAuth = true
  }
  Object.assign(error, extras)
  return error
}

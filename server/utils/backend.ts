import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

const LOOPBACK_BACKEND_BASE = 'http://127.0.0.1:8000'

/**
 * Resolves the backend base URL used for SSR-to-FastAPI requests.
 * We default to the loopback address because the FastAPI backend runs on the
 * same host in production; deployments that differ should override BACKEND_BASE.
 */
export function resolveBackendBase(event: H3Event): string {
  const config = useRuntimeConfig(event)
  const candidate = (config as any)?.backendBase || process.env.BACKEND_BASE
  const base = typeof candidate === 'string' && candidate.trim().length > 0 ? candidate.trim() : LOOPBACK_BACKEND_BASE
  return base.replace(/\/?$/, '')
}

/**
 * Helper to build a backend URL from a relative path while reusing the configured base.
 */
export function buildBackendUrl(event: H3Event, path: string): string {
  const base = resolveBackendBase(event)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

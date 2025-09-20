import type { AppliedTemplate, Template, TemplateCatalogResponse, TemplatePreview } from '~/types/template'
import { createHttpError } from './http-errors'

export interface CatalogParams {
  search?: string
  category?: string
  limit?: number
  offset?: number
  signal?: AbortSignal
  useCache?: boolean
}

export interface ApplyOptions {
  csrfToken?: string
  signal?: AbortSignal
}

const CACHE_KEY = 'anwalt.templates.cache'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function buildQuery(params: CatalogParams): string {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.category) searchParams.set('category', params.category)
  if (params.limit != null) searchParams.set('limit', String(params.limit))
  else if (!searchParams.has('limit')) searchParams.set('limit', '20')
  if (params.offset != null) searchParams.set('offset', String(params.offset))
  else if (!searchParams.has('offset')) searchParams.set('offset', '0')
  return searchParams.toString()
}

function readCache() {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as (TemplateCatalogResponse & { cachedAt?: number; search?: string; category?: string; limit?: number; offset?: number })
  } catch (_) {
    return null
  }
}

function writeCache(payload: TemplateCatalogResponse & { search?: string; category?: string; limit?: number; offset?: number }) {
  if (typeof localStorage === 'undefined') return
  try {
    const value = JSON.stringify({ ...payload, cachedAt: Date.now() })
    localStorage.setItem(CACHE_KEY, value)
  } catch (_) {
    // ignore storage errors
  }
}

async function parseJson(response: Response): Promise<any> {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch (_) {
    throw createHttpError(response.status, text || response.statusText)
  }
}

async function ensureOk(response: Response): Promise<void> {
  if (response.ok) return
  if (response.status === 401) {
    throw createHttpError(401, 'Authentifizierung erforderlich')
  }
  const payload = await parseJson(response)
  const message = payload.error || payload.message || response.statusText
  throw createHttpError(response.status, message, { data: payload })
}

function normalizeTemplate(data: any): Template {
  return {
    id: String(data.id),
    name: String(data.name || data.title || ''),
    description: String(data.description || ''),
    category: String(data.category || 'Sonstiges'),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    previewContent: String(data.previewContent || data.preview || ''),
    instructions: String(data.instructions || ''),
    suggestedDocType: data.suggestedDocType ?? data.docType ?? null,
    suggestedClauses: Array.isArray(data.suggestedClauses) ? data.suggestedClauses.map(String) : undefined,
    estimatedLength: typeof data.estimatedLength === 'number' ? data.estimatedLength : null,
    isActive: Boolean(data.isActive ?? true),
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  }
}

export const TemplatesService = {
  async listTemplates(params: CatalogParams = {}): Promise<TemplateCatalogResponse & { cachedAt?: number; search?: string; category?: string }> {
    const cache = readCache()
    const now = Date.now()
    const requestedSearch = params.search ?? ''
    const requestedCategory = params.category ?? ''
    const requestedLimit = params.limit ?? 20
    const requestedOffset = params.offset ?? 0
    if (params.useCache !== false && cache) {
      const cacheSearch = cache.search ?? ''
      const cacheCategory = cache.category ?? ''
      const cacheLimit = cache.limit ?? 20
      const cacheOffset = cache.offset ?? 0
      if (
        now - (cache.cachedAt ?? 0) < CACHE_TTL_MS &&
        cacheSearch === requestedSearch &&
        cacheCategory === requestedCategory &&
        cacheLimit === requestedLimit &&
        cacheOffset === requestedOffset
      ) {
        return cache
      }
    }

    const query = buildQuery(params)
    let response: Response
    try {
      response = await fetch(`/api/templates${query ? `?${query}` : ''}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        signal: params.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Vorlagen konnten nicht geladen werden', { data: error })
    }

    await ensureOk(response)
    const payload = await parseJson(response)

    const templates = Array.isArray(payload.templates) ? payload.templates.map(normalizeTemplate) : []
    const result: TemplateCatalogResponse & { cachedAt: number; search: string; category: string; limit: number; offset: number } = {
      templates,
      total: Number(payload.total ?? templates.length),
      categories: Array.isArray(payload.categories) ? payload.categories.map(String) : [],
      cachedAt: now,
      search: requestedSearch,
      category: requestedCategory,
      limit: requestedLimit,
      offset: requestedOffset,
    }

    writeCache(result)
    return result
  },

  async previewTemplate(id: string, signal?: AbortSignal): Promise<TemplatePreview> {
    if (!id) {
      throw createHttpError(400, 'Template-ID fehlt')
    }

    let response: Response
    try {
      response = await fetch(`/api/templates/${encodeURIComponent(id)}/preview`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Vorlagenvorschau fehlgeschlagen', { data: error })
    }

    await ensureOk(response)
    const payload = await parseJson(response)

    return {
      id: String(payload.id ?? id),
      name: String(payload.name || ''),
      description: String(payload.description || ''),
      previewContent: String(payload.previewContent || ''),
      metadata: payload.metadata,
    }
  },

  async applyTemplate(id: string, options: ApplyOptions = {}): Promise<AppliedTemplate> {
    if (!id) {
      throw createHttpError(400, 'Template-ID fehlt')
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (options.csrfToken) headers['X-CSRF-Token'] = options.csrfToken

    let response: Response
    try {
      response = await fetch(`/api/templates/${encodeURIComponent(id)}/apply`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({}),
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Vorlage konnte nicht angewendet werden', { data: error })
    }

    await ensureOk(response)
    const payload = await parseJson(response)

    return {
      configuration: payload.configuration ?? {},
      template: normalizeTemplate(payload.template ?? { id }),
    }
  },
}

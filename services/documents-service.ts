import type { Document, DocumentMetadata, DocumentStatus } from '~/types/document'
import { createHttpError } from './http-errors'

export interface GeneratePayload {
  uploadId?: string | null
  docType: string
  requirements: string
  legalTone: boolean
  plainLanguage: boolean
  clauses: string[]
  templateId?: string | null
}

export interface GenerateOptions {
  csrfToken?: string
  signal?: AbortSignal
}

export interface PollOptions {
  csrfToken?: string
  signal?: AbortSignal
}

export interface SaveOptions {
  csrfToken?: string
  metadata?: DocumentMetadata
  signal?: AbortSignal
}

export interface WorkflowOptions {
  csrfToken?: string
  comments?: string
  signal?: AbortSignal
}

export interface ExportOptions {
  csrfToken?: string
  signal?: AbortSignal
}

export type GenerateResponse =
  | { type: 'document'; document: Document }
  | { type: 'job'; jobId: string; estimatedTime?: number }

interface PollResponsePending {
  status: 'pending' | 'processing'
  progress?: number
}

interface PollResponseCompleted {
  status: 'completed'
  result: Document
}

interface PollResponseFailed {
  status: 'failed'
  error?: string
}

export type PollResponse = PollResponsePending | PollResponseCompleted | PollResponseFailed

const JSON_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

function buildHeaders(csrfToken?: string): HeadersInit {
  if (!csrfToken) return { ...JSON_HEADERS }
  return { ...JSON_HEADERS, 'X-CSRF-Token': csrfToken }
}

function computeWordCount(content: string): number {
  if (!content) return 0
  const text = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean).length
}

function parseDocument(data: any): Document {
  if (!data || typeof data !== 'object') {
    throw createHttpError(500, 'Ungültige Dokument-Antwort', { data })
  }

  const required = ['id', 'content', 'contentType', 'metadata', 'status', 'createdAt', 'updatedAt', 'userId'] as const
  const missing = required.filter((key) => data[key] === undefined || data[key] === null)
  if (missing.length) {
    throw createHttpError(500, `Dokumentantwort unvollständig: ${missing.join(', ')}`, { data })
  }

  const wordCount = Number(data.wordCount ?? computeWordCount(String(data.content)))
  const metadata = data.metadata as DocumentMetadata

  return {
    id: String(data.id),
    content: String(data.content),
    contentType: data.contentType === 'markdown' ? 'markdown' : 'html',
    wordCount: Number.isFinite(wordCount) ? wordCount : computeWordCount(String(data.content)),
    metadata: {
      docType: String(metadata.docType ?? ''),
      requirements: String(metadata.requirements ?? ''),
      legalTone: Boolean(metadata.legalTone),
      plainLanguage: Boolean(metadata.plainLanguage),
      clauses: Array.isArray(metadata.clauses) ? metadata.clauses.map(String) : [],
      templateId: metadata.templateId ?? null,
    },
    status: String(data.status) as DocumentStatus,
    uploadReference: data.uploadReference ?? null,
    createdAt: String(data.createdAt),
    updatedAt: String(data.updatedAt),
    userId: String(data.userId),
  }
}

async function parseJson(response: Response): Promise<any> {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch (error) {
    throw createHttpError(response.status, text || response.statusText, { data: { raw: text } })
  }
}

async function handleErrorResponse(response: Response): Promise<never> {
  if (response.status === 401) {
    throw createHttpError(401, 'Authentifizierung erforderlich')
  }

  const payload = await parseJson(response)
  const message = payload.error || payload.message || response.statusText

  if (response.status === 422) {
    throw createHttpError(422, message || 'Validierung fehlgeschlagen', {
      fieldErrors: payload.errors ?? payload.fieldErrors ?? {},
      data: payload,
    })
  }

  throw createHttpError(response.status, message || 'Unbekannter API-Fehler', { data: payload })
}

export const DocumentsService = {
  async generateDocument(payload: GeneratePayload, options: GenerateOptions = {}): Promise<GenerateResponse> {
    const endpoint = payload.plainLanguage && !payload.legalTone
      ? '/api/ai/generate-document-simple'
      : '/api/ai/generate-document'

    const body = endpoint.endsWith('simple')
      ? {
          uploadId: payload.uploadId ?? null,
          docType: payload.docType,
          requirements: payload.requirements,
          templateId: payload.templateId ?? null,
        }
      : payload

    let response: Response
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: buildHeaders(options.csrfToken),
        credentials: 'include',
        body: JSON.stringify(body),
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Dokumentgenerierung fehlgeschlagen', { data: error })
    }

    if (response.status === 202) {
      const jobPayload = await parseJson(response)
      if (!jobPayload.jobId) {
        throw createHttpError(202, 'Kein Job-Identifier erhalten', { data: jobPayload })
      }
      return { type: 'job', jobId: String(jobPayload.jobId), estimatedTime: jobPayload.estimatedTime }
    }

    if (!response.ok) {
      await handleErrorResponse(response)
    }

    const documentPayload = await parseJson(response)
    return { type: 'document', document: parseDocument(documentPayload) }
  },

  async pollGenerationJob(jobId: string, options: PollOptions = {}): Promise<PollResponse> {
    if (!jobId) {
      throw createHttpError(400, 'Job-ID fehlt')
    }

    let response: Response
    try {
      response = await fetch(`/api/documents/status/${encodeURIComponent(jobId)}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json', ...(options.csrfToken ? { 'X-CSRF-Token': options.csrfToken } : {}) },
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Statusabfrage fehlgeschlagen', { data: error })
    }

    if (!response.ok) {
      await handleErrorResponse(response)
    }

    const payload = await parseJson(response)
    const status = String(payload.status || 'processing') as PollResponse['status']

    if (status === 'completed' && payload.result) {
      return { status: 'completed', result: parseDocument(payload.result) }
    }

    if (status === 'failed') {
      return { status: 'failed', error: payload.error || 'Fehler bei der Generierung' }
    }

    return {
      status: status === 'pending' ? 'pending' : 'processing',
      progress: typeof payload.progress === 'number' ? payload.progress : undefined,
    }
  },

  async saveDocument(id: string | null, html: string, options: SaveOptions = {}): Promise<Document> {
    const payload = {
      ...(id ? { id } : {}),
      content: html,
      metadata: options.metadata ?? {},
    }

    let response: Response
    try {
      response = await fetch('/api/documents/save', {
        method: 'POST',
        headers: buildHeaders(options.csrfToken),
        credentials: 'include',
        body: JSON.stringify(payload),
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Speichern fehlgeschlagen', { data: error })
    }

    if (!response.ok) {
      await handleErrorResponse(response)
    }

    const data = await parseJson(response)
    return parseDocument(data)
  },

  async updateWorkflowStatus(id: string, status: DocumentStatus, options: WorkflowOptions = {}): Promise<Document> {
    if (!id) {
      throw createHttpError(400, 'Dokument-ID fehlt')
    }

    let response: Response
    try {
      response = await fetch(`/api/documents/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: buildHeaders(options.csrfToken),
        credentials: 'include',
        body: JSON.stringify({ status, comments: options.comments ?? null }),
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Workflow-Status konnte nicht aktualisiert werden', { data: error })
    }

    if (!response.ok) {
      await handleErrorResponse(response)
    }

    const data = await parseJson(response)
    return parseDocument(data)
  },

  async exportDocument(id: string, format: 'docx' | 'pdf', options: ExportOptions = {}) {
    if (!id) {
      throw createHttpError(400, 'Dokument-ID fehlt')
    }

    let response: Response
    try {
      response = await fetch(`/api/documents/${encodeURIComponent(id)}/export?format=${encodeURIComponent(format)}`, {
        method: 'GET',
        credentials: 'include',
        headers: options.csrfToken ? { 'X-CSRF-Token': options.csrfToken } : undefined,
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Export fehlgeschlagen', { data: error })
    }

    if (!response.ok) {
      await handleErrorResponse(response)
    }

    const blob = await response.blob()
    const mimeType = response.headers.get('Content-Type') || response.headers.get('content-type') || 'application/octet-stream'
    const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition')
    let filename = `document.${format}`
    const match = disposition?.match(/filename="?([^";]+)"?/i)
    if (match?.[1]) {
      filename = match[1]
    }

    return { blob, mimeType, filename }
  },
}

import type { Upload, UploadProgress } from '~/types/upload'
import { createHttpError } from './http-errors'

export interface UploadOptions {
  csrfToken?: string
  signal?: AbortSignal
  onProgress?: (event: UploadProgress) => void
}

export interface RemoveOptions {
  csrfToken?: string
  signal?: AbortSignal
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
])

const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'txt'])
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

function isSupportedFile(file: File) {
  if (file.type && ALLOWED_MIME_TYPES.has(file.type)) return true
  const parts = file.name.split('.')
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : null
  return !!ext && ALLOWED_EXTENSIONS.has(ext)
}

function emitProgress(handler: UploadOptions['onProgress'], loaded: number, total: number) {
  if (!handler) return
  const safeTotal = total || loaded
  const percent = safeTotal === 0 ? 0 : Math.min(100, Math.round((loaded / safeTotal) * 100))
  handler({ loaded, total: safeTotal, percent })
}

async function parseUploadResponse(response: Response): Promise<Upload> {
  const text = await response.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : {}
  } catch (error) {
    throw createHttpError(response.status, text || `Unexpected response (${response.status})`)
  }

  const required = ['id', 'filename', 'size', 'mimeType', 'uploadedAt'] as const
  const missing = required.filter((key) => data?.[key] === undefined || data?.[key] === null)
  if (missing.length) {
    throw createHttpError(response.status, `Upload response missing fields: ${missing.join(', ')}`, { data })
  }

  const upload: Upload = {
    id: String(data.id),
    filename: String(data.filename),
    size: Number(data.size),
    mimeType: String(data.mimeType),
    uploadedAt: String(data.uploadedAt),
    storageUrl: data.storageUrl ?? data.url ?? null,
    status: (data.status as Upload['status']) || 'completed',
    userId: data.userId ?? null,
  }
  if (data.expiresAt !== undefined) {
    upload.expiresAt = data.expiresAt
  }
  return upload
}

export const FilesService = {
  async upload(file: File, options: UploadOptions = {}): Promise<Upload> {
    if (!file) {
      throw createHttpError(400, 'No file provided')
    }

    if (!isSupportedFile(file)) {
      throw createHttpError(400, 'Dateityp wird nicht unterstützt. Erlaubt: PDF, DOC, DOCX, TXT')
    }

    if (file.size > MAX_FILE_SIZE) {
      throw createHttpError(413, 'Datei ist zu groß. Maximal 50 MB erlaubt')
    }

    emitProgress(options.onProgress, 0, file.size)

    const form = new FormData()
    form.append('file', file)

    const headers: HeadersInit = {
      Accept: 'application/json',
    }
    if (options.csrfToken) {
      headers['X-CSRF-Token'] = options.csrfToken
    }

    let response: Response
    try {
      response = await fetch('/api/files/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers,
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Upload fehlgeschlagen', { data: error })
    }

    if (response.status === 401) {
      throw createHttpError(401, 'Authentifizierung erforderlich')
    }

    if (!response.ok) {
      const text = await response.text()
      let message = text || response.statusText
      try {
        const parsed = JSON.parse(text)
        message = parsed.error || parsed.message || message
      } catch (_) {
        // keep raw text
      }
      throw createHttpError(response.status, message)
    }

    const upload = await parseUploadResponse(response)
    emitProgress(options.onProgress, file.size, file.size)
    return upload
  },

  async remove(id: string, options: RemoveOptions = {}): Promise<void> {
    if (!id) return

    const headers: HeadersInit = {
      Accept: 'application/json',
    }
    if (options.csrfToken) {
      headers['X-CSRF-Token'] = options.csrfToken
    }

    let response: Response
    try {
      response = await fetch(`/api/files/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
        signal: options.signal,
      })
    } catch (error: any) {
      throw createHttpError(0, error?.message || 'Fehler beim Entfernen der Datei', { data: error })
    }

    if (response.status === 401) {
      throw createHttpError(401, 'Authentifizierung erforderlich')
    }

    if (response.status === 404 || response.status === 204) {
      return
    }

    if (!response.ok) {
      const text = await response.text()
      throw createHttpError(response.status, text || response.statusText)
    }
  },
}

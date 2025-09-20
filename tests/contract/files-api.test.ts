import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FilesService } from '~/services/files-service'
import type { Upload } from '~/types/upload'

describe('FilesService – Files API contract', () => {
  const successPayload: Upload = {
    id: 'upload-123',
    filename: 'vertrag.pdf',
    size: 42_000,
    mimeType: 'application/pdf',
    uploadedAt: '2025-09-20T10:15:00.000Z',
    storageUrl: 'https://files.example.com/upload-123.pdf',
    status: 'completed',
    userId: 'user-1',
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('uploads supported files with FormData payload and returns typed response', async () => {
    const file = new File(['%PDF-1.4'], 'vertrag.pdf', { type: 'application/pdf' })

    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(successPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const onProgress = vi.fn()
    const result = await FilesService.upload(file, { onProgress, csrfToken: 'csrf-token', signal: undefined })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/files/upload')
    expect(options?.method).toBe('POST')
    expect(options?.credentials).toBe('include')
    expect(options?.headers).toMatchObject({
      'X-CSRF-Token': 'csrf-token',
    })

    const body = options?.body
    expect(body).toBeInstanceOf(FormData)
    const entries = Array.from((body as FormData).entries())
    expect(entries).toHaveLength(1)
    expect(entries[0][0]).toBe('file')
    const uploaded = entries[0][1] as File
    expect(uploaded.name).toBe('vertrag.pdf')
    expect(uploaded.type).toBe('application/pdf')

    expect(result).toEqual(successPayload)
    expect(onProgress).toHaveBeenCalled()
    expect(onProgress.mock.calls[0][0].percent).toBe(0)
    expect(onProgress.mock.calls.at(-1)?.[0].percent).toBe(100)
  })

  it('rejects unsupported file types before making a network request', async () => {
    const file = new File(['binary'], 'image.png', { type: 'image/png' })

    const fetchSpy = vi.spyOn(global, 'fetch')

    await expect(FilesService.upload(file)).rejects.toThrow(/unterstützt|supported/i)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('propagates backend validation errors with clear messaging', async () => {
    const file = new File(['%PDF-1.4'], 'gross.pdf', { type: 'application/pdf' })
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'File size exceeds limit' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(FilesService.upload(file)).rejects.toMatchObject({
      status: 413,
      message: 'File size exceeds limit',
    })
  })

  it('sends authenticated delete request to cleanup upload', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    await FilesService.remove('upload-123', { csrfToken: 'csrf-token' })

    const [url, options] = (global.fetch as any).mock.calls[0]
    expect(url).toBe('/api/files/upload-123')
    expect(options?.method).toBe('DELETE')
    expect(options?.credentials).toBe('include')
    expect(options?.headers).toMatchObject({ 'X-CSRF-Token': 'csrf-token' })
  })

  it('handles unauthorized responses by throwing RedirectRequired error', async () => {
    const file = new File(['%PDF-1.4'], 'vertrag.pdf', { type: 'application/pdf' })
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('Unauthorized', { status: 401 }),
    )

    await expect(FilesService.upload(file)).rejects.toMatchObject({
      status: 401,
      requiresAuth: true,
    })
  })
})

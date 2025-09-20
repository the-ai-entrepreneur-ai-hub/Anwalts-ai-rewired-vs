import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('~/services/files-service', () => {
  return {
    FilesService: {
      upload: vi.fn(),
      remove: vi.fn(),
    },
  }
})

import { FilesService } from '~/services/files-service'
import { useDocumentAssistantStore } from '~/stores/document-assistant'

const mockUploadResponse = {
  id: 'upload-123',
  filename: 'vertrag.pdf',
  size: 42000,
  mimeType: 'application/pdf',
  uploadedAt: '2025-09-20T10:15:00.000Z',
  storageUrl: 'https://files.example.com/upload-123.pdf',
  status: 'completed',
  userId: 'user-1',
}

describe('Document assistant – file upload integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('handles drag/drop upload with progress tracking and success state', async () => {
    const onProgressEvents = [
      { loaded: 0, total: 42000, percent: 0 },
      { loaded: 21000, total: 42000, percent: 50 },
      { loaded: 42000, total: 42000, percent: 100 },
    ]
    vi.mocked(FilesService.upload).mockImplementation(async (_file, options) => {
      onProgressEvents.forEach(event => options?.onProgress?.(event))
      return mockUploadResponse
    })

    const store = useDocumentAssistantStore()

    const file = new File(['%PDF-1.4'], 'vertrag.pdf', { type: 'application/pdf' })
    await store.uploadFile(file, { csrfToken: 'csrf-token' })

    expect(FilesService.upload).toHaveBeenCalledWith(file, expect.objectContaining({
      csrfToken: 'csrf-token',
      onProgress: expect.any(Function),
    }))

    expect(store.upload.status).toBe('success')
    expect(store.upload.progress).toBe(100)
    expect(store.upload.current?.id).toBe('upload-123')
    expect(store.configuration.uploadId).toBe('upload-123')
  })

  it('captures upload errors and exposes retry handler', async () => {
    vi.mocked(FilesService.upload).mockRejectedValue({ status: 413, message: 'File size exceeds limit' })

    const store = useDocumentAssistantStore()
    const file = new File(['%PDF'], 'zu-gross.pdf', { type: 'application/pdf' })

    await expect(store.uploadFile(file)).rejects.toMatchObject({ status: 413 })
    expect(store.upload.status).toBe('error')
    expect(store.upload.error).toContain('File size exceeds limit')

    vi.mocked(FilesService.upload).mockResolvedValue(mockUploadResponse)
    await store.retryUpload()

    expect(store.upload.status).toBe('success')
    expect(store.configuration.uploadId).toBe('upload-123')
  })

  it('clears upload state and notifies backend when reset', async () => {
    const store = useDocumentAssistantStore()

    vi.mocked(FilesService.upload).mockResolvedValue(mockUploadResponse)
    await store.uploadFile(new File(['%PDF'], 'vertrag.pdf', { type: 'application/pdf' }))

    await store.resetUpload()

    expect(FilesService.remove).toHaveBeenCalledWith('upload-123', expect.any(Object))
    expect(store.upload.current).toBeNull()
    expect(store.configuration.uploadId).toBeNull()
    expect(store.upload.status).toBe('idle')
  })
})

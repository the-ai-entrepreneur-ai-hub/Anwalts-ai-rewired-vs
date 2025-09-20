import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('~/services/documents-service', () => {
  return {
    DocumentsService: {
      generateDocument: vi.fn(),
      pollGenerationJob: vi.fn(),
      saveDocument: vi.fn(),
      updateWorkflowStatus: vi.fn(),
      exportDocument: vi.fn(),
    },
  }
})

import { DocumentsService } from '~/services/documents-service'
import { useDocumentAssistantStore } from '~/stores/document-assistant'

const storedDocument = {
  id: 'doc-123',
  content: '<p>Doc</p>',
  contentType: 'html',
  wordCount: 200,
  metadata: {
    docType: 'NDA',
    requirements: 'Req',
    legalTone: true,
    plainLanguage: false,
    clauses: [],
    templateId: null,
  },
  status: 'draft',
  uploadReference: null,
  createdAt: '2025-09-20T10:20:00.000Z',
  updatedAt: '2025-09-20T10:20:00.000Z',
  userId: 'user-1',
}

describe('Document assistant – workflow actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('saves document content and updates workflow state', async () => {
    vi.mocked(DocumentsService.saveDocument).mockResolvedValue({
      ...storedDocument,
      status: 'pending_approval',
    })

    const store = useDocumentAssistantStore()
    store.setPreviewContent('<p>Doc</p>')
    store.document.current = storedDocument

    const result = await store.saveDocument({ csrfToken: 'csrf-token' })

    expect(DocumentsService.saveDocument).toHaveBeenCalledWith('doc-123', '<p>Doc</p>', {
      metadata: storedDocument.metadata,
      csrfToken: 'csrf-token',
    })
    expect(store.workflow.status).toBe('pending_approval')
    expect(store.document.current?.updatedAt).toBeDefined()
    expect(result.status).toBe('pending_approval')
  })

  it('updates workflow status via PATCH and records history', async () => {
    vi.mocked(DocumentsService.updateWorkflowStatus).mockResolvedValue({
      ...storedDocument,
      status: 'approved',
    })

    const store = useDocumentAssistantStore()
    store.document.current = storedDocument
    store.workflow.status = 'pending_approval'

    await store.updateWorkflowStatus('approved', { comments: 'Looks good', csrfToken: 'csrf-token' })

    expect(DocumentsService.updateWorkflowStatus).toHaveBeenCalledWith('doc-123', 'approved', {
      comments: 'Looks good',
      csrfToken: 'csrf-token',
    })
    expect(store.workflow.status).toBe('approved')
    expect(store.workflow.history.at(-1)?.status).toBe('approved')
  })

  it('downloads exports and exposes blob metadata', async () => {
    const blob = new Blob(['binary'], { type: 'application/pdf' })
    vi.mocked(DocumentsService.exportDocument).mockResolvedValue({
      blob,
      filename: 'NDA.pdf',
      mimeType: 'application/pdf',
    })

    const store = useDocumentAssistantStore()
    store.document.current = storedDocument

    const result = await store.exportDocument('pdf', { csrfToken: 'csrf-token' })

    expect(DocumentsService.exportDocument).toHaveBeenCalledWith('doc-123', 'pdf', { csrfToken: 'csrf-token' })
    expect(result.filename).toBe('NDA.pdf')
    expect(result.mimeType).toBe('application/pdf')
    expect(store.workflow.exportInProgress).toBe(false)
  })
})

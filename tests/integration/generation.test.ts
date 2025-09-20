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

const generatedDocument = {
  id: 'doc-123',
  content: '<h1>NDA</h1><script>alert(1)</script><p>Body</p>',
  contentType: 'html',
  wordCount: 1200,
  metadata: {
    docType: 'NDA',
    requirements: 'Confidentiality agreement',
    legalTone: true,
    plainLanguage: false,
    clauses: ['confidentiality'],
    templateId: 'template-nda',
  },
  status: 'draft',
  uploadReference: 'upload-123',
  createdAt: '2025-09-20T10:20:00.000Z',
  updatedAt: '2025-09-20T10:20:00.000Z',
  userId: 'user-1',
}

describe('Document assistant – document generation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('submits configuration, shows loading, and stores sanitized preview on success', async () => {
    vi.mocked(DocumentsService.generateDocument).mockResolvedValue({ type: 'document', document: generatedDocument })

    const store = useDocumentAssistantStore()
    store.setDocType('NDA')
    store.setRequirements('Confidentiality agreement with penalty clause for data leaks.')
    store.toggleClause('confidentiality')
    store.configuration.uploadId = 'upload-123'
    store.configuration.templateId = 'template-nda'

    const promise = store.generateDocument({ csrfToken: 'csrf-token' })
    expect(store.generation.status).toBe('loading')
    await promise

    expect(DocumentsService.generateDocument).toHaveBeenCalledWith(expect.objectContaining({
      uploadId: 'upload-123',
      docType: 'NDA',
      requirements: expect.stringContaining('penalty clause'),
      legalTone: true,
      plainLanguage: false,
      clauses: ['confidentiality'],
      templateId: 'template-nda',
    }), { csrfToken: 'csrf-token' })

    expect(store.generation.status).toBe('success')
    expect(store.preview.html).toContain('<h1>NDA</h1>')
    expect(store.preview.sanitizedHtml).not.toContain('<script>')
    expect(store.preview.wordCount).toBeGreaterThan(0)
    expect(store.workflow.status).toBe('draft')
  })

  it('handles async job responses and polls until completion', async () => {
    vi.mocked(DocumentsService.generateDocument).mockResolvedValue({ type: 'job', jobId: 'job-1', estimatedTime: 5 })
    vi.mocked(DocumentsService.pollGenerationJob).mockResolvedValueOnce({
      status: 'processing',
      progress: 50,
    }).mockResolvedValueOnce({
      status: 'completed',
      result: generatedDocument,
    })

    const store = useDocumentAssistantStore()
    store.setDocType('NDA')
    store.setRequirements('Bitte NDA erstellen mit Vertragsstrafe.')

    await store.generateDocument()

    expect(store.generation.status).toBe('success')
    expect(store.preview.html).toContain('<h1>NDA</h1>')
    expect(DocumentsService.pollGenerationJob).toHaveBeenCalledWith('job-1', expect.any(Object))
  })

  it('captures validation errors and exposes field errors inline', async () => {
    vi.mocked(DocumentsService.generateDocument).mockRejectedValue({
      status: 422,
      fieldErrors: {
        docType: ['required'],
      },
      message: 'Validation failed',
    })

    const store = useDocumentAssistantStore()
    store.setDocType('')
    store.setRequirements('Kurz')

    await expect(store.generateDocument()).rejects.toMatchObject({ status: 422 })
    expect(store.errors.field.docType[0]).toBe('required')
    expect(store.generation.status).toBe('error')
  })
})

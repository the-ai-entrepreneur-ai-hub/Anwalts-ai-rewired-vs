import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DocumentsService } from '~/services/documents-service'
import type { Document } from '~/types/document'

const samplePayload = {
  uploadId: 'upload-123',
  docType: 'Geheimhaltungsvereinbarung',
  requirements: 'Vertrag zwischen Partei A und Partei B mit Vertragsstrafe.',
  legalTone: true,
  plainLanguage: false,
  clauses: ['confidentiality', 'penalty'],
  templateId: 'template-nda-standard',
}

const sampleDocument: Document = {
  id: 'doc-123',
  content: '<h1>Geheimhaltungsvereinbarung</h1>',
  contentType: 'html',
  wordCount: 1200,
  metadata: {
    docType: 'Geheimhaltungsvereinbarung',
    requirements: samplePayload.requirements,
    legalTone: true,
    plainLanguage: false,
    clauses: ['confidentiality', 'penalty'],
    templateId: 'template-nda-standard',
  },
  status: 'draft',
  uploadReference: 'upload-123',
  createdAt: '2025-09-20T10:20:00.000Z',
  updatedAt: '2025-09-20T10:20:00.000Z',
  userId: 'user-42',
}

describe('DocumentsService – Documents API contract', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('POST /api/ai/generate-document with full payload when plain language disabled', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sampleDocument), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await DocumentsService.generateDocument(samplePayload, { csrfToken: 'csrf-token' })

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/ai/generate-document')
    expect(options?.method).toBe('POST')
    expect(options?.credentials).toBe('include')
    expect(options?.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-CSRF-Token': 'csrf-token',
    })
    expect(JSON.parse(String(options?.body))).toEqual(samplePayload)
    expect(result).toEqual({ type: 'document', document: sampleDocument })
  })

  it('uses /api/ai/generate-document-simple when plainLanguage is true', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sampleDocument), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const payload = { ...samplePayload, legalTone: false, plainLanguage: true }
    await DocumentsService.generateDocument(payload)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/ai/generate-document-simple')
    expect(JSON.parse(String(options?.body))).toMatchObject({
      uploadId: 'upload-123',
      docType: payload.docType,
      requirements: payload.requirements,
      templateId: payload.templateId,
    })
  })

  it('returns job reference when backend responds with 202 Accepted', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ jobId: 'job-123', estimatedTime: 12 }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await DocumentsService.generateDocument(samplePayload)
    expect(result).toEqual({ type: 'job', jobId: 'job-123', estimatedTime: 12 })
  })

  it('throws structured validation errors on 422', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ errors: { docType: ['required'], requirements: ['too_short'] } }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(DocumentsService.generateDocument(samplePayload)).rejects.toMatchObject({
      status: 422,
      fieldErrors: {
        docType: ['required'],
        requirements: ['too_short'],
      },
    })
  })

  it('throws redirect-required error on 401 responses', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('Unauthorized', { status: 401 }))
    await expect(DocumentsService.generateDocument(samplePayload)).rejects.toMatchObject({
      status: 401,
      requiresAuth: true,
    })
  })

  it('saves documents with POST /api/documents/save', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sampleDocument), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await DocumentsService.saveDocument('doc-123', '<p>Updated</p>', {
      metadata: sampleDocument.metadata,
      csrfToken: 'csrf-token',
    })

    const [url, options] = (global.fetch as any).mock.calls[0]
    expect(url).toBe('/api/documents/save')
    expect(JSON.parse(String(options?.body))).toMatchObject({
      id: 'doc-123',
      content: '<p>Updated</p>',
      metadata: sampleDocument.metadata,
    })
    expect(result).toEqual(sampleDocument)
  })

  it('patches workflow status with PATCH /api/documents/{id}/status', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ...sampleDocument, status: 'approved' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await DocumentsService.updateWorkflowStatus('doc-123', 'approved', {
      comments: 'Sieht gut aus',
      csrfToken: 'csrf-token',
    })

    const [url, options] = (global.fetch as any).mock.calls[0]
    expect(url).toBe('/api/documents/doc-123/status')
    expect(options?.method).toBe('PATCH')
    expect(JSON.parse(String(options?.body))).toEqual({ status: 'approved', comments: 'Sieht gut aus' })
    expect(result.status).toBe('approved')
  })

  it('downloads binary exports via GET /api/documents/{id}/export?format=docx', async () => {
    const blobResponse = new Response('binary', {
      status: 200,
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    })
    vi.spyOn(global, 'fetch').mockResolvedValue(blobResponse)

    const result = await DocumentsService.exportDocument('doc-123', 'docx', { csrfToken: 'csrf-token' })

    const [url, options] = (global.fetch as any).mock.calls[0]
    expect(url).toBe('/api/documents/doc-123/export?format=docx')
    expect(options?.method).toBe('GET')
    expect(options?.headers).toMatchObject({ 'X-CSRF-Token': 'csrf-token' })
    expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    const buffer = await result.blob.arrayBuffer()
    expect(buffer.byteLength).toBeGreaterThan(0)
  })
})

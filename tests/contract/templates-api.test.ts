import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TemplatesService } from '~/services/templates-service'
import type { Template } from '~/types/template'

const catalogResponse = {
  templates: [
    {
      id: 'template-nda',
      name: 'NDA Standard',
      description: 'Geheimhaltungsvereinbarung',
      category: 'Vertrag',
      tags: ['nda', 'vertrag'],
      previewContent: '<h1>NDA</h1>',
      instructions: 'Nutze juristischen Stil',
      suggestedDocType: 'Geheimhaltungsvereinbarung',
      suggestedClauses: ['confidentiality'],
      isActive: true,
      createdAt: '2025-09-01T12:00:00Z',
      updatedAt: '2025-09-10T12:00:00Z',
    },
  ],
  total: 1,
  categories: ['Vertrag', 'Arbeitsrecht'],
}

describe('TemplatesService – Templates API contract', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    const storage = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value) },
      removeItem: (key: string) => { storage.delete(key) },
      clear: () => storage.clear(),
      key: (index: number) => Array.from(storage.keys())[index] ?? null,
      get length() { return storage.size },
    })
  })

  it('fetches template catalog with query params and caches in localStorage', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(catalogResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await TemplatesService.listTemplates({ search: 'nda', limit: 12, offset: 0 })

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/templates')
    expect(url).toContain('search=nda')
    expect(url).toContain('limit=12')
    expect(options?.method).toBe('GET')
    expect(result.templates).toHaveLength(1)

    const cached = localStorage.getItem('anwalt.templates.cache')
    expect(cached).toBeTruthy()
    expect(JSON.parse(String(cached))).toMatchObject({
      templates: catalogResponse.templates,
      total: 1,
    })
  })

  it('returns cached templates when available and fresh', async () => {
    localStorage.setItem('anwalt.templates.cache', JSON.stringify({
      templates: catalogResponse.templates,
      total: 1,
      categories: catalogResponse.categories,
      cachedAt: Date.now(),
    }))
    const fetchSpy = vi.spyOn(global, 'fetch')

    const result = await TemplatesService.listTemplates({ useCache: true })
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(result.templates[0].id).toBe('template-nda')
  })

  it('fetches individual template preview', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        id: 'template-nda',
        name: 'NDA Standard',
        description: 'Preview',
        previewContent: '<p>Preview</p>',
        metadata: {
          suggestedDocType: 'NDA',
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const preview = await TemplatesService.previewTemplate('template-nda')
    const [url] = (global.fetch as any).mock.calls[0]
    expect(url).toBe('/api/templates/template-nda/preview')
    expect(preview.previewContent).toContain('<p>Preview</p>')
  })

  it('applies template metadata using POST /api/templates/{id}/apply', async () => {
    const applyResponse = {
      configuration: {
        docType: 'Geheimhaltungsvereinbarung',
        instructions: 'Füge Vertragsstrafe hinzu',
        suggestedClauses: ['confidentiality'],
      },
      template: catalogResponse.templates[0] as Template,
    }
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(applyResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await TemplatesService.applyTemplate('template-nda', { csrfToken: 'csrf-token' })

    const [url, options] = (global.fetch as any).mock.calls[0]
    expect(url).toBe('/api/templates/template-nda/apply')
    expect(options?.method).toBe('POST')
    expect(options?.headers).toMatchObject({ 'X-CSRF-Token': 'csrf-token' })
    expect(result.configuration.docType).toBe('Geheimhaltungsvereinbarung')
  })

  it('throws redirect-required errors on 401 responses', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('Unauthorized', { status: 401 }))
    await expect(TemplatesService.listTemplates({ search: 'nda' })).rejects.toMatchObject({
      status: 401,
      requiresAuth: true,
    })
  })
})

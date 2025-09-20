import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('~/services/templates-service', () => {
  return {
    TemplatesService: {
      listTemplates: vi.fn(),
      previewTemplate: vi.fn(),
      applyTemplate: vi.fn(),
    },
  }
})

import { TemplatesService } from '~/services/templates-service'
import { useDocumentAssistantStore } from '~/stores/document-assistant'

const catalog = {
  templates: [
    {
      id: 'template-nda',
      name: 'NDA Standard',
      description: 'Standard NDA',
      category: 'Vertrag',
      tags: ['nda'],
      previewContent: '<h1>NDA</h1>',
      instructions: 'Juristischer Stil',
      suggestedDocType: 'Geheimhaltungsvereinbarung',
      suggestedClauses: ['confidentiality'],
      isActive: true,
      createdAt: '2025-09-01T12:00:00Z',
      updatedAt: '2025-09-10T12:00:00Z',
    },
  ],
  total: 1,
  categories: ['Vertrag'],
}

describe('Document assistant – template modal integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const storage = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value) },
      removeItem: (key: string) => { storage.delete(key) },
      clear: () => storage.clear(),
      key: (index: number) => Array.from(storage.keys())[index] ?? null,
      get length() { return storage.size },
    })
    vi.clearAllMocks()
  })

  it('loads templates from backend and caches metadata', async () => {
    vi.mocked(TemplatesService.listTemplates).mockResolvedValue({
      ...catalog,
      cachedAt: Date.now(),
    })

    const store = useDocumentAssistantStore()
    await store.loadTemplates({ search: 'nda' })

    expect(TemplatesService.listTemplates).toHaveBeenCalledWith({
      search: 'nda',
      category: undefined,
      signal: undefined,
    })
    expect(store.templates.items).toHaveLength(1)
    expect(localStorage.getItem('anwalt.template.selected')).toBeNull()
  })

  it('applies template metadata to configuration and persists selection', async () => {
    vi.mocked(TemplatesService.listTemplates).mockResolvedValue({ ...catalog, cachedAt: Date.now() })
    vi.mocked(TemplatesService.applyTemplate).mockResolvedValue({
      configuration: {
        docType: 'Geheimhaltungsvereinbarung',
        instructions: 'Bitte Vertragsstrafe hinzufügen',
        suggestedClauses: ['confidentiality'],
      },
      template: catalog.templates[0],
    })

    const store = useDocumentAssistantStore()
    await store.loadTemplates({})
    await store.applyTemplate('template-nda', { csrfToken: 'csrf-token' })

    expect(store.configuration.docType).toBe('Geheimhaltungsvereinbarung')
    expect(store.configuration.selectedClauses).toContain('confidentiality')
    expect(store.configuration.isDirty).toBe(true)
    expect(localStorage.getItem('anwalt.template.selected')).toBe('template-nda')
  })

  it('debounces search requests and reuses cached results', async () => {
    const store = useDocumentAssistantStore()
    vi.mocked(TemplatesService.listTemplates).mockResolvedValue({ ...catalog, cachedAt: Date.now() })

    await store.searchTemplates('vertrag')
    await store.searchTemplates('vertrag')

    expect(TemplatesService.listTemplates).toHaveBeenCalledTimes(1)
    expect(store.templates.searchTerm).toBe('vertrag')
  })
})

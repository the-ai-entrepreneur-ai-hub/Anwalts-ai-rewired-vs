import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useDocumentAssistantStore } from '~/stores/document-assistant'

describe('Document assistant – configuration capture', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('enforces mutual exclusivity between legal tone and plain language toggles', () => {
    const store = useDocumentAssistantStore()

    expect(store.configuration.legalTone).toBe(true)
    expect(store.configuration.plainLanguage).toBe(false)

    store.togglePlainLanguage()
    expect(store.configuration.plainLanguage).toBe(true)
    expect(store.configuration.legalTone).toBe(false)

    store.toggleLegalTone()
    expect(store.configuration.legalTone).toBe(true)
    expect(store.configuration.plainLanguage).toBe(false)
  })

  it('tracks docType, requirements, and character count', () => {
    const store = useDocumentAssistantStore()

    store.setDocType('Mietvertrag')
    store.setRequirements('Standard residential lease for Berlin property with pet clause.')

    expect(store.configuration.docType).toBe('Mietvertrag')
    expect(store.configuration.requirements).toContain('Berlin property')
    expect(store.configuration.charCount).toBe(store.configuration.requirements.length)
    expect(store.configuration.isDirty).toBe(true)
  })

  it('toggles clause chips and tracks selection set', () => {
    const store = useDocumentAssistantStore()

    store.toggleClause('liability')
    store.toggleClause('termination')
    expect(store.configuration.selectedClauses).toEqual(['liability', 'termination'])

    store.toggleClause('liability')
    expect(store.configuration.selectedClauses).toEqual(['termination'])
  })

  it('validates configuration and returns descriptive errors', () => {
    const store = useDocumentAssistantStore()

    store.setDocType('')
    store.setRequirements('Kurz')

    const result = store.validateConfiguration()
    expect(result.isValid).toBe(false)
    expect(result.errors.docType[0]).toMatch(/erforderlich|required/i)
    expect(result.errors.requirements[0]).toBe('min_length')

    store.setDocType('Aufhebungsvertrag')
    store.setRequirements('Bitte erstellen Sie einen Aufhebungsvertrag mit Sozialplan und Freistellungsklausel.')

    const success = store.validateConfiguration()
    expect(success.isValid).toBe(true)
  })
})

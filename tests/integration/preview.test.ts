import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useDocumentAssistantStore } from '~/stores/document-assistant'

describe('Document assistant – preview and editing', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('toggles editing mode and tracks dirty state', () => {
    const store = useDocumentAssistantStore()
    store.setPreviewContent('<p>Initial</p>')

    expect(store.preview.isEditing).toBe(false)
    store.toggleEditing()
    expect(store.preview.isEditing).toBe(true)

    store.updatePreviewContent('<p>Changed</p>')
    expect(store.preview.isDirty).toBe(true)
    expect(store.preview.wordCount).toBe(1)

    store.toggleEditing()
    expect(store.preview.isEditing).toBe(false)
  })

  it('copies preview content to clipboard and exposes status', async () => {
    const store = useDocumentAssistantStore()
    store.setPreviewContent('<p>Copy me</p>')
    await store.copyPreview()

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me')
    expect(store.preview.lastCopiedAt).toBeGreaterThan(0)
  })

  it('restores original content when resetEditing is called', () => {
    const store = useDocumentAssistantStore()
    store.setPreviewContent('<p>Original</p>')
    store.toggleEditing()
    store.updatePreviewContent('<p>Edited</p>')

    store.resetEditing()

    expect(store.preview.html).toContain('Original')
    expect(store.preview.isDirty).toBe(false)
  })
})

import { defineStore } from 'pinia'
import createDOMPurify from 'dompurify'

import { FilesService, type UploadOptions } from '~/services/files-service'
import {
  DocumentsService,
  type GenerateOptions,
  type PollOptions,
  type SaveOptions,
  type WorkflowOptions,
  type ExportOptions,
} from '~/services/documents-service'
import { TemplatesService, type CatalogParams, type ApplyOptions } from '~/services/templates-service'
import { createHttpError, type HttpError } from '~/services/http-errors'

import type { Upload } from '~/types/upload'
import type { Document, DocumentMetadata, DocumentStatus } from '~/types/document'
import type { Template } from '~/types/template'
import type { ConfigurationValidationResult } from '~/types/configuration'
import type { WorkflowStatusEntry } from '~/types/workflow-status'

const TEMPLATE_STORAGE_KEY = 'anwalt.template.selected'

const DOM_SANITIZER = typeof window !== 'undefined' ? createDOMPurify(window) : null

function sanitizeHtml(input: string): string {
  if (!input) return ''
  if (DOM_SANITIZER) {
    return DOM_SANITIZER.sanitize(input, { USE_PROFILES: { html: true } })
  }
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on[a-z]+="[^"]*"/gi, '')
}

function stripHtml(input: string): string {
  return sanitizeHtml(input)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function computeWordCount(html: string): number {
  const text = stripHtml(html)
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

function uniqueClauses(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

const FIELD_ERROR_MAP: Record<string, Record<string, string>> = {
  docType: {
    required: 'Bitte Dokumenttyp angeben.',
    min_length: 'Mindestens 3 Zeichen erforderlich.',
  },
  requirements: {
    required: 'Bitte Anforderungen ergänzen.',
    min_length: 'Mindestens 10 Zeichen erforderlich.',
  },
  legalTone: {
    conflict: 'Juristische und leichte Sprache sind gleichzeitig nicht möglich.',
  },
}

function translateFieldError(field: string, code: string): string {
  return FIELD_ERROR_MAP[field]?.[code] ?? code
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  current: Upload | null
  error: string | null
  lastFile: File | null
  lastOptions: UploadOptions | null
}

interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  jobId: string | null
  progress: number
}

interface PreviewState {
  html: string
  sanitizedHtml: string
  wordCount: number
  isEditing: boolean
  isDirty: boolean
  originalHtml: string
  lastCopiedAt: number
  clipboardError: string | null
}

interface TemplatesState {
  items: Template[]
  categories: string[]
  total: number
  searchTerm: string
  isLoading: boolean
  lastFetchedAt: number
  selectedId: string | null
}

interface ErrorsState {
  global: string | null
  banner: string | null
  field: Record<string, string[]>
}

interface DocumentState {
  current: Document | null
  lastSavedAt: number | null
}

interface WorkflowState {
  status: DocumentStatus
  history: WorkflowStatusEntry[]
  exportInProgress: boolean
}

export const useDocumentAssistantStore = defineStore('document-assistant', {
  state: () => ({
    upload: {
      status: 'idle',
      progress: 0,
      current: null,
      error: null,
      lastFile: null,
      lastOptions: null,
    } as UploadState,
    configuration: {
      docType: '',
      requirements: '',
      charCount: 0,
      legalTone: true,
      plainLanguage: false,
      selectedClauses: [] as string[],
      uploadId: null as string | null,
      templateId: null as string | null,
      isDirty: false,
    },
    generation: {
      status: 'idle',
      error: null,
      jobId: null,
      progress: 0,
    } as GenerationState,
    preview: {
      html: '',
      sanitizedHtml: '',
      wordCount: 0,
      isEditing: false,
      isDirty: false,
      originalHtml: '',
      lastCopiedAt: 0,
      clipboardError: null,
    } as PreviewState,
    document: {
      current: null,
      lastSavedAt: null,
    } as DocumentState,
    workflow: {
      status: 'draft' as DocumentStatus,
      history: [] as WorkflowStatusEntry[],
      exportInProgress: false,
    } as WorkflowState,
    templates: {
      items: [] as Template[],
      categories: [] as string[],
      total: 0,
      searchTerm: '',
      isLoading: false,
      lastFetchedAt: 0,
      selectedId: null as string | null,
    } as TemplatesState,
    errors: {
      global: null,
      banner: null,
      field: {} as Record<string, string[]>,
    } as ErrorsState,
  }),
  getters: {
    isGenerateEnabled(state): boolean {
      const { docType, requirements } = state.configuration
      return docType.trim().length >= 3 && requirements.trim().length >= 10 && state.generation.status !== 'loading'
    },
    fieldErrorMessage(state): (field: string) => string | null {
      return (field: string) => {
        const code = state.errors.field[field]?.[0]
        if (!code) return null
        return translateFieldError(field, code)
      }
    },
  },
  actions: {
    clearFieldErrors(keys?: string[]) {
      if (!keys || keys.length === 0) {
        this.errors.field = {}
        return
      }
      const clone = { ...this.errors.field }
      keys.forEach((key) => delete clone[key])
      this.errors.field = clone
    },

    setDocType(value: string) {
      this.configuration.docType = value
      this.configuration.isDirty = true
      this.clearFieldErrors(['docType'])
    },

    setRequirements(value: string) {
      this.configuration.requirements = value
      this.configuration.charCount = value.length
      this.configuration.isDirty = true
      this.clearFieldErrors(['requirements'])
    },

    toggleLegalTone() {
      const next = !this.configuration.legalTone
      this.configuration.legalTone = next
      if (next) {
        this.configuration.plainLanguage = false
      }
      this.configuration.isDirty = true
      this.clearFieldErrors(['legalTone'])
    },

    togglePlainLanguage() {
      const next = !this.configuration.plainLanguage
      this.configuration.plainLanguage = next
      if (next) {
        this.configuration.legalTone = false
      }
      this.configuration.isDirty = true
      this.clearFieldErrors(['plainLanguage', 'legalTone'])
    },

    toggleClause(id: string) {
      if (!id) return
      const clauses = new Set(this.configuration.selectedClauses)
      if (clauses.has(id)) {
        clauses.delete(id)
      } else {
        clauses.add(id)
      }
      this.configuration.selectedClauses = Array.from(clauses)
      this.configuration.isDirty = true
    },

    validateConfiguration(): ConfigurationValidationResult {
      const errors: Record<string, string[]> = {}
      const { docType, requirements, legalTone, plainLanguage } = this.configuration
      const trimmedType = docType.trim()
      const trimmedReq = requirements.trim()
      if (!trimmedType) {
        errors.docType = ['required']
      } else if (trimmedType.length < 3) {
        errors.docType = ['min_length']
      }
      if (!trimmedReq) {
        errors.requirements = ['required']
      } else if (trimmedReq.length < 10) {
        errors.requirements = ['min_length']
      }
      if (legalTone && plainLanguage) {
        errors.legalTone = ['conflict']
      }
      const isValid = Object.keys(errors).length === 0
      this.errors.field = errors
      return { isValid, errors }
    },

    async uploadFile(file: File, options: UploadOptions = {}) {
      this.upload.status = 'uploading'
      this.upload.progress = 0
      this.upload.error = null
      this.upload.lastFile = file
      this.upload.lastOptions = options
      try {
        const upload = await FilesService.upload(file, {
          ...options,
          onProgress: (event) => {
            this.upload.progress = event.percent
          },
        })
        this.upload.current = upload
        this.upload.status = 'success'
        this.upload.progress = 100
        this.configuration.uploadId = upload.id
        this.errors.banner = null
        this.errors.field.upload = []
        return upload
      } catch (error: any) {
        const httpError = error?.status ? (error as HttpError) : createHttpError(500, error?.message || 'Upload fehlgeschlagen')
        this.upload.status = 'error'
        this.upload.error = httpError.message
        this.errors.banner = httpError.message
        this.errors.field.upload = [httpError.message]
        if (httpError.requiresAuth) {
          this.errors.global = 'Bitte melden Sie sich erneut an.'
        }
        throw httpError
      }
    },

    async retryUpload() {
      if (!this.upload.lastFile) {
        throw createHttpError(400, 'Keine Datei zum erneuten Hochladen vorhanden.')
      }
      return this.uploadFile(this.upload.lastFile, this.upload.lastOptions ?? {})
    },

    async resetUpload() {
      const id = this.upload.current?.id
      if (id) {
        try {
          await FilesService.remove(id, this.upload.lastOptions ?? undefined)
        } catch (error) {
          console.warn('Upload cleanup fehlgeschlagen:', error)
        }
      }
      this.upload = {
        status: 'idle',
        progress: 0,
        current: null,
        error: null,
        lastFile: null,
        lastOptions: null,
      }
      this.configuration.uploadId = null
    },

    setPreviewContent(html: string) {
      const sanitized = sanitizeHtml(html)
      this.preview.html = html
      this.preview.sanitizedHtml = sanitized
      this.preview.wordCount = computeWordCount(sanitized)
      this.preview.originalHtml = sanitized
      this.preview.isDirty = false
    },

    toggleEditing() {
      this.preview.isEditing = !this.preview.isEditing
      if (this.preview.isEditing) {
        this.preview.originalHtml = this.preview.sanitizedHtml
      } else {
        this.preview.sanitizedHtml = this.preview.originalHtml
        this.preview.html = this.preview.originalHtml
        this.preview.isDirty = false
      }
    },

    updatePreviewContent(html: string) {
      const sanitized = sanitizeHtml(html)
      this.preview.html = html
      this.preview.sanitizedHtml = sanitized
      this.preview.wordCount = computeWordCount(sanitized)
      this.preview.isDirty = sanitized !== this.preview.originalHtml
    },

    resetEditing() {
      this.preview.html = this.preview.originalHtml
      this.preview.sanitizedHtml = this.preview.originalHtml
      this.preview.wordCount = computeWordCount(this.preview.sanitizedHtml)
      this.preview.isDirty = false
      this.preview.isEditing = false
    },

    async copyPreview() {
      const text = stripHtml(this.preview.sanitizedHtml)
      if (!text) {
        this.preview.clipboardError = 'Nichts zum Kopieren vorhanden.'
        throw createHttpError(400, this.preview.clipboardError)
      }
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        const error = createHttpError(0, 'Clipboard API nicht verfügbar')
        this.preview.clipboardError = error.message
        throw error
      }
      await navigator.clipboard.writeText(text)
      this.preview.lastCopiedAt = Date.now()
      this.preview.clipboardError = null
    },

    hydrateTemplateSelection() {
      if (typeof localStorage === 'undefined') return
      try {
        const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY)
        if (stored) {
          this.templates.selectedId = stored
        }
      } catch (_) {
        // ignore
      }
    },

    persistTemplateSelection(id: string | null) {
      if (typeof localStorage === 'undefined') return
      try {
        if (id) {
          localStorage.setItem(TEMPLATE_STORAGE_KEY, id)
        } else {
          localStorage.removeItem(TEMPLATE_STORAGE_KEY)
        }
      } catch (_) {
        // ignore storage failures
      }
    },

    async loadTemplates(params: CatalogParams = {}) {
      this.templates.isLoading = true
      try {
        const response = await TemplatesService.listTemplates(params)
        this.templates.items = response.templates
        this.templates.categories = response.categories
        this.templates.total = response.total
        this.templates.lastFetchedAt = response.cachedAt ?? Date.now()
        this.templates.searchTerm = params.search ?? this.templates.searchTerm
        if (!this.templates.selectedId && typeof localStorage !== 'undefined') {
          this.hydrateTemplateSelection()
        }
        return response
      } finally {
        this.templates.isLoading = false
      }
    },

    async applyTemplate(id: string, options: ApplyOptions = {}) {
      const result = await TemplatesService.applyTemplate(id, options)
      this.templates.selectedId = id
      this.persistTemplateSelection(id)
      if (result.configuration.docType) {
        this.setDocType(result.configuration.docType)
      }
      if (result.configuration.instructions) {
        this.setRequirements(result.configuration.instructions)
      }
      if (result.configuration.suggestedClauses?.length) {
        this.configuration.selectedClauses = uniqueClauses(result.configuration.suggestedClauses)
      }
      this.configuration.templateId = id
      return result
    },

    async searchTemplates(term: string) {
      if (term === this.templates.searchTerm) {
        return this.templates.items
      }
      this.templates.searchTerm = term
      return this.loadTemplates({ search: term })
    },

    setGlobalError(message: string | null) {
      this.errors.global = message
    },

    setBanner(message: string | null) {
      this.errors.banner = message
    },

    async generateDocument(options: GenerateOptions = {}) {
      const validation = this.validateConfiguration()
      if (!validation.isValid) {
        this.generation.status = 'error'
        const error = createHttpError(422, 'Validierung fehlgeschlagen', { fieldErrors: validation.errors })
        this.generation.error = error.message
        this.setBanner('Bitte Eingaben prüfen.')
        throw error
      }

      this.generation.status = 'loading'
      this.generation.error = null
      this.generation.jobId = null
      this.generation.progress = 0
      this.setBanner(null)

      const payload = {
        uploadId: this.configuration.uploadId,
        docType: this.configuration.docType.trim(),
        requirements: this.configuration.requirements.trim(),
        legalTone: this.configuration.legalTone,
        plainLanguage: this.configuration.plainLanguage,
        clauses: this.configuration.selectedClauses.slice(),
        templateId: this.configuration.templateId,
      }

      try {
        const response = await DocumentsService.generateDocument(payload, options)
        if (response.type === 'job') {
          this.generation.jobId = response.jobId
          return this.pollGenerationJob(response.jobId, options)
        }
        this.handleDocumentResponse(response.document)
        return response.document
      } catch (error: any) {
        const httpError = error?.status ? (error as HttpError) : createHttpError(500, error?.message || 'Generierung fehlgeschlagen')
        this.generation.status = 'error'
        this.generation.error = httpError.message
        if (httpError.fieldErrors) {
          this.errors.field = httpError.fieldErrors
        }
        if (httpError.requiresAuth) {
          this.errors.global = 'Bitte Anmeldung erneuern, um fortzufahren.'
        }
        this.setBanner(httpError.message)
        throw httpError
      }
    },

    async pollGenerationJob(jobId: string, options: PollOptions = {}) {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const status = await DocumentsService.pollGenerationJob(jobId, options)
        if (status.status === 'completed' && status.result) {
          this.handleDocumentResponse(status.result)
          return status.result
        }
        if (status.status === 'failed') {
          const error = createHttpError(500, status.error || 'Generierung fehlgeschlagen')
          this.generation.status = 'error'
          this.generation.error = error.message
          throw error
        }
        this.generation.progress = status.progress ?? this.generation.progress
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
      const timeoutError = createHttpError(504, 'Generierung überschreitet das Zeitlimit')
      this.generation.status = 'error'
      this.generation.error = timeoutError.message
      throw timeoutError
    },

    handleDocumentResponse(document: Document) {
      this.document.current = document
      this.workflow.status = document.status
      this.configuration.isDirty = false
      this.generation.status = 'success'
      this.generation.error = null
      this.generation.jobId = null
      this.generation.progress = 100

      this.setPreviewContent(document.content)
    },

    async saveDocument(options: SaveOptions = {}) {
      if (!this.preview.sanitizedHtml) {
        throw createHttpError(400, 'Kein Dokument zum Speichern vorhanden')
      }

      const metadata: DocumentMetadata = this.document.current?.metadata ?? {
        docType: this.configuration.docType.trim(),
        requirements: this.configuration.requirements.trim(),
        legalTone: this.configuration.legalTone,
        plainLanguage: this.configuration.plainLanguage,
        clauses: this.configuration.selectedClauses.slice(),
        templateId: this.configuration.templateId,
      }

      const id = this.document.current?.id ?? null
      const document = await DocumentsService.saveDocument(id, this.preview.sanitizedHtml, {
        metadata,
        csrfToken: options.csrfToken,
        signal: options.signal,
      })

      this.document.current = document
      this.document.lastSavedAt = Date.now()
      this.workflow.status = document.status
      this.preview.isDirty = false
      this.generation.status = 'success'
      return document
    },

    async updateWorkflowStatus(status: DocumentStatus, options: WorkflowOptions = {}) {
      if (!this.document.current?.id) {
        throw createHttpError(400, 'Kein Dokument für Workflow-Aktion vorhanden')
      }

      const document = await DocumentsService.updateWorkflowStatus(this.document.current.id, status, options)
      const entry: WorkflowStatusEntry = {
        documentId: document.id,
        status: document.status,
        actionBy: 'me',
        actionAt: new Date().toISOString(),
        comments: options.comments ?? null,
        previousStatus: this.workflow.status,
      }
      this.document.current = document
      this.workflow.status = document.status
      this.workflow.history = [...this.workflow.history, entry]
      return document
    },

    async exportDocument(format: 'docx' | 'pdf', options: ExportOptions = {}) {
      if (!this.document.current?.id) {
        throw createHttpError(400, 'Kein Dokument zum Exportieren vorhanden')
      }
      this.workflow.exportInProgress = true
      try {
        const response = await DocumentsService.exportDocument(this.document.current.id, format, options)
        return response
      } finally {
        this.workflow.exportInProgress = false
      }
    },
  },
})

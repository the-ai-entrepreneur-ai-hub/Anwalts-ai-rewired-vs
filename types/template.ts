export interface Template {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  previewContent: string
  instructions: string
  suggestedDocType?: string | null
  suggestedClauses?: string[]
  estimatedLength?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateCatalogResponse {
  templates: Template[]
  total: number
  categories: string[]
  cachedAt?: number
}

export interface TemplatePreview {
  id: string
  name: string
  description: string
  previewContent: string
  metadata?: {
    suggestedDocType?: string
    suggestedClauses?: string[]
    estimatedLength?: number
  }
}

export interface AppliedTemplate {
  configuration: {
    docType?: string
    instructions?: string
    suggestedClauses?: string[]
  }
  template: Template
}

export interface Configuration {
  docType: string
  requirements: string
  charCount: number
  legalTone: boolean
  plainLanguage: boolean
  selectedClauses: string[]
  uploadId?: string | null
  templateId?: string | null
  isDirty: boolean
}

export interface ConfigurationValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

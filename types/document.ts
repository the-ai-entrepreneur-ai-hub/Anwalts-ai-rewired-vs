export type DocumentStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'accepted'

export type DocumentContentType = 'html' | 'markdown'

export interface DocumentMetadata {
  docType: string
  requirements: string
  legalTone: boolean
  plainLanguage: boolean
  clauses: string[]
  templateId?: string | null
}

export interface Document {
  id: string
  content: string
  contentType: DocumentContentType
  wordCount: number
  metadata: DocumentMetadata
  status: DocumentStatus
  uploadReference?: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

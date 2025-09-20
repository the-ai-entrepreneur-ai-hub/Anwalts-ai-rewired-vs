export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error' | 'deleted'

export interface Upload {
  id: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
  storageUrl?: string | null
  status: UploadStatus
  userId?: string | null
  expiresAt?: string | null
  errorMessage?: string | null
}

export interface UploadProgress {
  loaded: number
  total: number
  percent: number
}

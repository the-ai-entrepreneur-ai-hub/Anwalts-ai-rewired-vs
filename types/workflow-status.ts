import type { DocumentStatus } from './document'

export interface WorkflowStatusEntry {
  documentId: string
  status: DocumentStatus
  actionBy: string
  actionAt: string
  comments?: string | null
  previousStatus?: DocumentStatus | null
}

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  title?: string | null
  role: 'user' | 'admin' | 'partner'
  firm_name: string
  avatar_url?: string | null
}

export interface DashboardStats {
  cases: {
    new_count: number
    new_change_percent: number
  }
  documents: {
    total_count: number
    active_count: number
  }
  emails: {
    total_count: number
    auto_processed: number
  }
  next_deadline: {
    date: string
    days_until: number
    title: string
  }
}

export type DocumentStatus = 'draft' | 'review' | 'final' | 'archived'
export type DocumentType = 'contract' | 'brief' | 'letter' | 'motion' | 'agreement' | 'other'

export interface DocumentSummary {
  id: string
  title: string
  type: DocumentType
  status: DocumentStatus
  progress: number | null
  case_number?: string | null
  created_at: string
  updated_at: string
  updated_by: string
  file_size: number
  file_format: string
}

export type DeadlineType = 'court_filing' | 'meeting' | 'hearing' | 'deadline' | 'other'
export type DeadlinePriority = 'high' | 'medium' | 'low'
export type DeadlineStatus = 'pending' | 'completed' | 'overdue'

export interface DeadlineSummary {
  id: string
  title: string
  type: DeadlineType
  due_date: string
  case_number?: string | null
  court_name?: string | null
  priority: DeadlinePriority
  status: DeadlineStatus
  assigned_to: string
  created_at: string
  notes?: string | null
}

export type ActivityType = 'email' | 'call' | 'upload' | 'document' | 'meeting'

export interface ActivityEntry {
  id: string
  type: ActivityType
  title: string
  description: string
  status: string
  client_name?: string | null
  case_number?: string | null
  timestamp: string
  created_by: string
  metadata?: Record<string, unknown> | null
}

export interface Pagination {
  page: number
  limit: number
  total_pages: number
}

export interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
  timestamp: string
}

export interface DocumentsListResponse {
  success: boolean
  data: {
    documents: DocumentSummary[]
    total_count: number
    has_more: boolean
  }
  pagination: Pagination
  timestamp: string
}

export interface DeadlinesListResponse {
  success: boolean
  data: {
    deadlines: DeadlineSummary[]
    total_count: number
    overdue_count: number
  }
  timestamp: string
}

export interface ActivityFeedResponse {
  success: boolean
  data: {
    activities: ActivityEntry[]
    total_count: number
    has_more: boolean
  }
  pagination: Pagination
  timestamp: string
}

export interface UserProfileResponse {
  success: boolean
  data: UserProfile
  timestamp: string
}

export interface DashboardState {
  stats: DashboardStats | null
  documents: DocumentSummary[]
  deadlines: DeadlineSummary[]
  activities: ActivityEntry[]
  loading: {
    stats: boolean
    documents: boolean
    deadlines: boolean
    activities: boolean
  }
  errors: {
    stats: string | null
    documents: string | null
    deadlines: string | null
    activities: string | null
  }
  lastRefresh: {
    stats: Date | null
    documents: Date | null
    deadlines: Date | null
    activities: Date | null
  }
}

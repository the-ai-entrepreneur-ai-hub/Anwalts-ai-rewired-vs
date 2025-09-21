import { useRuntimeConfig } from '#imports'
import type {
  DashboardStatsResponse,
  DocumentsListResponse,
  DeadlinesListResponse,
  ActivityFeedResponse,
  UserProfileResponse,
} from '~/types/dashboard'

function apiBase(): string {
  const config = useRuntimeConfig()
  const base = config.public.apiBase || '/api'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

function apiFetch<T>(path: string, params?: Record<string, any>) {
  const query = params ? { params } : undefined
  return $fetch<T>(`${apiBase()}${path}`, {
    credentials: 'include',
    method: 'GET',
    ...query,
  })
}

export async function fetchDashboardStats(): Promise<DashboardStatsResponse> {
  return apiFetch<DashboardStatsResponse>('/dashboard/stats')
}

export async function fetchRecentDocuments(options?: { limit?: number; offset?: number }): Promise<DocumentsListResponse> {
  return apiFetch<DocumentsListResponse>('/dashboard/documents', options)
}

export async function fetchUpcomingDeadlines(options?: { limit?: number; days_ahead?: number }): Promise<DeadlinesListResponse> {
  return apiFetch<DeadlinesListResponse>('/dashboard/deadlines', options)
}

export async function fetchRecentActivity(options?: { limit?: number; type?: string | null }): Promise<ActivityFeedResponse> {
  const params: Record<string, any> = {}
  if (options?.limit) params.limit = options.limit
  if (options?.type) params.type = options.type
  return apiFetch<ActivityFeedResponse>('/dashboard/activity', params)
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  return apiFetch<UserProfileResponse>('/dashboard/profile')
}

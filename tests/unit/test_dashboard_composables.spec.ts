import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useDashboardData } from '~/composables/useDashboardData'
import { useUserProfile } from '~/composables/useUserProfile'

vi.mock('~/services/dashboard-api', () => ({
  fetchDashboardStats: vi.fn().mockResolvedValue({
    success: true,
    data: {
      cases: { new_count: 5, new_change_percent: 12.5 },
      documents: { total_count: 10, active_count: 4 },
      emails: { total_count: 30, auto_processed: 12 },
      next_deadline: { date: '2025-09-20', days_until: 3, title: 'Beschwerde' },
    },
    timestamp: new Date().toISOString(),
  }),
  fetchRecentDocuments: vi.fn().mockResolvedValue({
    success: true,
    data: {
      documents: [
        {
          id: 'doc-1',
          title: 'Memo',
          type: 'brief',
          status: 'draft',
          progress: 50,
          case_number: '123',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: 'user_demo',
          file_size: 1024,
          file_format: 'pdf',
        },
      ],
      total_count: 1,
      has_more: false,
    },
    pagination: { page: 1, limit: 10, total_pages: 1 },
    timestamp: new Date().toISOString(),
  }),
  fetchUpcomingDeadlines: vi.fn().mockResolvedValue({
    success: true,
    data: {
      deadlines: [
        {
          id: 'deadline-1',
          title: 'Termin',
          type: 'meeting',
          due_date: '2025-09-19',
          case_number: '123',
          court_name: null,
          priority: 'high',
          status: 'pending',
          assigned_to: 'user_demo',
          created_at: new Date().toISOString(),
          notes: null,
        },
      ],
      total_count: 1,
      overdue_count: 0,
    },
    timestamp: new Date().toISOString(),
  }),
  fetchRecentActivity: vi.fn().mockResolvedValue({
    success: true,
    data: {
      activities: [
        {
          id: 'activity-1',
          type: 'email',
          title: 'Neue Nachricht',
          description: 'Mandant hat geantwortet',
          status: 'read',
          client_name: 'Schmidt',
          case_number: '123',
          timestamp: new Date().toISOString(),
          created_by: 'user_demo',
          metadata: null,
        },
      ],
      total_count: 1,
      has_more: false,
    },
    pagination: { page: 1, limit: 10, total_pages: 1 },
    timestamp: new Date().toISOString(),
  }),
  fetchUserProfile: vi.fn().mockResolvedValue({
    success: true,
    data: {
      id: 'user_demo',
      email: 'demo@example.com',
      first_name: 'Max',
      last_name: 'Müller',
      title: 'Partner',
      role: 'partner',
      firm_name: 'Demo Kanzlei',
      avatar_url: null,
    },
    timestamp: new Date().toISOString(),
  }),
}))

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('dashboard composables', () => {
  it('loads dashboard data into the store', async () => {
    const dashboard = useDashboardData()
    await dashboard.loadAll(true)

    expect(dashboard.stats.value?.cases.new_count).toBe(5)
    expect(dashboard.documents.value).toHaveLength(1)
    expect(dashboard.deadlines.value).toHaveLength(1)
    expect(dashboard.activities.value).toHaveLength(1)
  })

  it('loads the user profile', async () => {
    const { profile, loadProfile } = useUserProfile()
    await loadProfile(true)
    expect(profile.value?.email).toBe('demo@example.com')
  })
})

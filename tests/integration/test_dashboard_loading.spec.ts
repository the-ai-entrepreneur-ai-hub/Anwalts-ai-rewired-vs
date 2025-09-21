import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useDashboardData } from '~/composables/useDashboardData'

vi.mock('~/services/dashboard-api', () => ({
  fetchDashboardStats: vi.fn().mockResolvedValue({
    success: true,
    data: {
      cases: { new_count: 3, new_change_percent: 10 },
      documents: { total_count: 5, active_count: 2 },
      emails: { total_count: 12, auto_processed: 4 },
      next_deadline: { date: '2025-09-01', days_until: 5, title: 'Frist' },
    },
    timestamp: new Date().toISOString(),
  }),
  fetchRecentDocuments: vi.fn().mockResolvedValue({
    success: true,
    data: {
      documents: [
        {
          id: 'doc-1',
          title: 'Aktennotiz',
          type: 'brief',
          status: 'draft',
          progress: 20,
          case_number: 'A-1',
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
          title: 'Gerichtstermin',
          type: 'court_filing',
          due_date: '2025-09-05',
          case_number: 'A-1',
          court_name: 'OLG',
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
          title: 'Neue E-Mail',
          description: 'Neue Nachricht erhalten',
          status: 'read',
          client_name: 'Mandant',
          case_number: 'A-1',
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
}))

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('dashboard data loading', () => {
  it('populates all sections with API results', async () => {
    const { loadAll, stats, documents, deadlines, activities } = useDashboardData()

    await loadAll(true)

    expect(stats.value?.cases.new_count).toBe(3)
    expect(documents.value.length).toBeGreaterThan(0)
    expect(deadlines.value.length).toBeGreaterThan(0)
    expect(activities.value.length).toBeGreaterThan(0)
  })
})

import { storeToRefs } from 'pinia'

import {
  fetchDashboardStats,
  fetchRecentDocuments,
  fetchUpcomingDeadlines,
  fetchRecentActivity,
} from '~/services/dashboard-api'
import { useDashboardStore } from '~/stores/dashboard'
import { useApiCache } from '~/composables/useApiCache'

export function useDashboardData() {
  const store = useDashboardStore()
  const state = storeToRefs(store)
  const statsCache = useApiCache('dashboard:stats', fetchDashboardStats, { ttl: 1000 * 60 * 5 })
  const documentsCache = useApiCache('dashboard:documents', () => fetchRecentDocuments({ limit: 10 }), { ttl: 1000 * 60 * 2 })
  const deadlinesCache = useApiCache('dashboard:deadlines', () => fetchUpcomingDeadlines({ limit: 10 }), { ttl: 1000 * 60 * 5 })
  const activityCache = useApiCache('dashboard:activity', () => fetchRecentActivity({ limit: 10 }), { ttl: 1000 * 60 })

  async function loadStats(force = false) {
    if (store.loading.stats && !force) return
    store.setLoading('stats', true)
    store.setError('stats', null)
    try {
      const response = await statsCache.refresh(force)
      store.setStats(response.data)
    } catch (error: any) {
      store.setError('stats', error?.data?.error?.message || error?.message || 'Statistiken konnten nicht geladen werden')
      throw error
    } finally {
      store.setLoading('stats', false)
    }
  }

  async function loadDocuments(force = false) {
    if (store.loading.documents && !force) return
    store.setLoading('documents', true)
    store.setError('documents', null)
    try {
      const response = await documentsCache.refresh(force)
      store.setDocuments(response.data.documents)
    } catch (error: any) {
      store.setError('documents', error?.data?.error?.message || error?.message || 'Dokumente konnten nicht geladen werden')
      throw error
    } finally {
      store.setLoading('documents', false)
    }
  }

  async function loadDeadlines(force = false) {
    if (store.loading.deadlines && !force) return
    store.setLoading('deadlines', true)
    store.setError('deadlines', null)
    try {
      const response = await deadlinesCache.refresh(force)
      store.setDeadlines(response.data.deadlines)
    } catch (error: any) {
      store.setError('deadlines', error?.data?.error?.message || error?.message || 'Fristen konnten nicht geladen werden')
      throw error
    } finally {
      store.setLoading('deadlines', false)
    }
  }

  async function loadActivities(force = false) {
    if (store.loading.activities && !force) return
    store.setLoading('activities', true)
    store.setError('activities', null)
    try {
      const response = await activityCache.refresh(force)
      store.setActivities(response.data.activities)
    } catch (error: any) {
      store.setError('activities', error?.data?.error?.message || error?.message || 'Aktivitäten konnten nicht geladen werden')
      throw error
    } finally {
      store.setLoading('activities', false)
    }
  }

  async function loadAll(force = false) {
    const loaders = [loadStats(force), loadDocuments(force), loadDeadlines(force), loadActivities(force)]
    await Promise.all(loaders)
  }

  return {
    ...state,
    loadAll,
    loadStats,
    loadDocuments,
    loadDeadlines,
    loadActivities,
    setError: store.setError.bind(store),
  }
}

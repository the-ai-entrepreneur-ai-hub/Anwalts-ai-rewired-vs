import { defineStore } from 'pinia'
import type {
  DashboardState,
  DashboardStats,
  DocumentSummary,
  DeadlineSummary,
  ActivityEntry,
} from '~/types/dashboard'

function defaultState(): DashboardState {
  return {
    stats: null,
    documents: [],
    deadlines: [],
    activities: [],
    loading: {
      stats: false,
      documents: false,
      deadlines: false,
      activities: false,
    },
    errors: {
      stats: null,
      documents: null,
      deadlines: null,
      activities: null,
    },
    lastRefresh: {
      stats: null,
      documents: null,
      deadlines: null,
      activities: null,
    },
  }
}

export const useDashboardStore = defineStore('dashboard', {
  state: defaultState,
  getters: {
    hasErrors: (state) =>
      !!(state.errors.stats || state.errors.documents || state.errors.deadlines || state.errors.activities),
  },
  actions: {
    reset() {
      Object.assign(this, defaultState())
    },
    setStats(payload: DashboardStats) {
      this.stats = payload
      this.lastRefresh.stats = new Date()
    },
    setDocuments(payload: DocumentSummary[]) {
      this.documents = payload
      this.lastRefresh.documents = new Date()
    },
    setDeadlines(payload: DeadlineSummary[]) {
      this.deadlines = payload
      this.lastRefresh.deadlines = new Date()
    },
    setActivities(payload: ActivityEntry[]) {
      this.activities = payload
      this.lastRefresh.activities = new Date()
    },
    setLoading(section: keyof DashboardState['loading'], value: boolean) {
      this.loading[section] = value
    },
    setError(section: keyof DashboardState['errors'], message: string | null) {
      this.errors[section] = message
    },
  },
})

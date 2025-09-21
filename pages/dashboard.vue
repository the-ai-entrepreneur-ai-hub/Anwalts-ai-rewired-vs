<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="flex h-screen">
      <aside class="relative w-64 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-[#5b7ce6] to-[#4a6cd4] rounded-lg flex items-center justify-center text-white font-bold">
              {{ firmInitials }}
            </div>
            <div>
              <h1 class="font-semibold text-gray-900">ANWALTS.AI</h1>
              <p class="text-xs text-gray-500">Kanzlei-Dashboard</p>
            </div>
          </div>
        </div>

        <nav class="p-4 space-y-1">
          <NuxtLink to="/dashboard" class="sidebar-link" active-class="active">Übersicht</NuxtLink>
          <NuxtLink to="/assistant" class="sidebar-link">KI-Assistent</NuxtLink>
          <NuxtLink to="/dashboard/cases" class="sidebar-link">Fälle</NuxtLink>
          <NuxtLink to="/documents" class="sidebar-link">Dokumente</NuxtLink>
          <NuxtLink to="/dashboard/settings" class="sidebar-link">Einstellungen</NuxtLink>
        </nav>

        <div class="mt-auto p-4 border-t border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-sm font-semibold text-slate-700">
              {{ profileInitials }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ profileName }}</p>
              <p class="text-xs text-gray-500">{{ profileTitle }}</p>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <header class="bg-white border-b border-gray-200">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p class="text-sm text-gray-500">Willkommen zurück</p>
              <h2 class="text-2xl font-semibold">{{ profileName }}</h2>
              <p class="text-sm text-gray-500">{{ profileTitle }} · {{ firmName }}</p>
              <p class="text-xs text-gray-400 mt-1">Zuletzt aktualisiert: {{ lastRefreshLabel }}</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="btn-secondary flex items-center gap-2"
                :disabled="isRefreshing"
                @click="refreshDashboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582M20 20l.001-5H20m-2.002-3A7 7 0 105.582 9m12.836 6A7.002 7.002 0 0112 19">
                  </path>
                </svg>
                <span>{{ isRefreshing ? 'Aktualisiere…' : 'Aktualisieren' }}</span>
              </button>
              <button type="button" class="btn-primary" @click="goToAssistant">KI-Assistent öffnen</button>
            </div>
          </div>
        </header>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <transition name="fade">
            <div v-if="alertMessage" class="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start justify-between">
              <span>{{ alertMessage }}</span>
              <button type="button" class="text-red-600 underline text-xs" @click="clearAlert">Schließen</button>
            </div>
          </transition>

          <!-- Stats Cards -->
          <section aria-labelledby="dashboard-stats">
            <h3 id="dashboard-stats" class="sr-only">Kennzahlen</h3>
            <div
              v-if="errors.value.stats"
              class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between"
            >
              <span>{{ errors.value.stats }}</span>
              <button type="button" class="text-xs font-medium underline" @click="retrySection('stats')">Erneut versuchen</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <article v-for="card in statCards" :key="card.key" class="stat-card">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-xs uppercase tracking-wide text-gray-500">{{ card.label }}</p>
                    <p class="text-2xl font-semibold text-gray-900">
                      <span v-if="card.loading" class="animate-pulse text-gray-400">—</span>
                      <span v-else>{{ card.value }}</span>
                    </p>
                  </div>
                  <span v-if="card.badge" :class="['badge', card.badgeVariant]">{{ card.badge }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ card.caption }}</p>
              </article>
            </div>
          </section>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Documents -->
            <section class="lg:col-span-2 card" aria-labelledby="recent-documents">
              <header class="flex items-center justify-between mb-4">
                <h3 id="recent-documents" class="text-lg font-semibold text-gray-900">Aktuelle Dokumente</h3>
                <NuxtLink to="/documents" class="btn-secondary text-xs">Alle Dokumente</NuxtLink>
              </header>

              <div v-if="errors.value.documents" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
                <span>{{ errors.value.documents }}</span>
                <button type="button" class="text-xs font-medium underline" @click="retrySection('documents')">Erneut versuchen</button>
              </div>

              <div v-if="loading.value.documents" class="space-y-3" aria-live="polite">
                <div class="skeleton h-16 rounded-lg" v-for="n in 3" :key="n"></div>
              </div>

              <ul v-else-if="documents.value.length" class="space-y-3">
                <li
                  v-for="doc in documents.value"
                  :key="doc.id"
                  class="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ doc.title }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatDocumentMeta(doc) }} · Zuletzt aktualisiert {{ formatRelative(doc.updated_at) }}
                    </p>
                  </div>
                  <span :class="['badge', doc.status === 'final' ? 'badge-success' : 'badge-primary']">{{ statusLabel(doc.status) }}</span>
                </li>
              </ul>

              <p v-else class="text-sm text-gray-500">Keine Dokumente vorhanden.</p>
            </section>

            <!-- Deadlines -->
            <section class="card" aria-labelledby="upcoming-deadlines">
              <header class="flex items-center justify-between mb-4">
                <h3 id="upcoming-deadlines" class="text-lg font-semibold text-gray-900">Bevorstehende Fristen</h3>
                <NuxtLink to="/dashboard/cases" class="btn-secondary text-xs">Alle Fristen</NuxtLink>
              </header>

              <div v-if="errors.value.deadlines" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
                <span>{{ errors.value.deadlines }}</span>
                <button type="button" class="text-xs font-medium underline" @click="retrySection('deadlines')">Erneut versuchen</button>
              </div>

              <div v-if="loading.value.deadlines" class="space-y-3">
                <div class="skeleton h-14 rounded-lg" v-for="n in 3" :key="n"></div>
              </div>

              <ul v-else-if="deadlines.value.length" class="space-y-3">
                <li v-for="deadline in deadlines.value" :key="deadline.id" class="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900">{{ deadline.title }}</p>
                      <p class="text-xs text-gray-500">Fällig am {{ formatDate(deadline.due_date) }} · {{ deadline.priority.toUpperCase() }}</p>
                    </div>
                    <span :class="['badge', deadlineBadge(deadline.status)]">{{ statusLabel(deadline.status) }}</span>
                  </div>
                </li>
              </ul>

              <p v-else class="text-sm text-gray-500">Keine Fristen innerhalb der nächsten 30 Tage.</p>
            </section>
          </div>

          <!-- Activity -->
          <section class="card" aria-labelledby="recent-activity">
            <header class="flex items-center justify-between mb-4">
              <div>
                <h3 id="recent-activity" class="text-lg font-semibold text-gray-900">Aktivitäten</h3>
                <p class="text-xs text-gray-500">Neueste Ereignisse in Ihren Fällen</p>
              </div>
              <NuxtLink to="/dashboard/cases" class="btn-secondary text-xs">Protokoll öffnen</NuxtLink>
            </header>

            <div v-if="errors.value.activities" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
              <span>{{ errors.value.activities }}</span>
              <button type="button" class="text-xs font-medium underline" @click="retrySection('activities')">Erneut versuchen</button>
            </div>

            <div v-if="loading.value.activities" class="space-y-3">
              <div class="skeleton h-14 rounded-lg" v-for="n in 4" :key="n"></div>
            </div>

            <ul v-else-if="activities.value.length" class="space-y-3">
              <li v-for="activity in activities.value" :key="activity.id" class="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500">{{ formatActivityMeta(activity) }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                  </div>
                  <span class="badge badge-muted">{{ activity.type.toUpperCase() }}</span>
                </div>
              </li>
            </ul>

            <p v-else class="text-sm text-gray-500">Noch keine Aktivitäten vorhanden.</p>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from '#imports'
import { useDashboardData } from '~/composables/useDashboardData'
import { useUserProfile } from '~/composables/useUserProfile'
import { useApiError } from '~/composables/useApiError'
import { useDataRefresh } from '~/composables/useDataRefresh'

definePageMeta({ middleware: ['dashboard-auth'] })

const router = useRouter()
const { profile, loadProfile } = useUserProfile()
const dashboard = useDashboardData()
const { lastError, capture, reset } = useApiError()

async function performRefresh() {
  await Promise.all([dashboard.loadAll(true), loadProfile(true)])
}

const refreshManager = useDataRefresh(performRefresh, { interval: 1000 * 60 * 3 })
const { isRefreshing, lastRefreshed } = refreshManager
const lastRefreshLabel = computed(() => {
  if (!lastRefreshed.value) return 'Noch nicht aktualisiert'
  return formatRelative(lastRefreshed.value.toISOString())
})

const firmInitials = computed(() => {
  const firm = profile.value?.firm_name || 'AA'
  return firm
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('') || 'AA'
})

const profileInitials = computed(() => {
  if (!profile.value) return '--'
  const parts = [profile.value.first_name, profile.value.last_name].filter(Boolean)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
})

const profileName = computed(() => {
  if (!profile.value) return 'Profil wird geladen…'
  return `${profile.value.first_name} ${profile.value.last_name}`.trim()
})

const profileTitle = computed(() => profile.value?.title || roleLabels[profile.value?.role || 'user'])
const firmName = computed(() => profile.value?.firm_name || 'Unzugeordnete Kanzlei')

const roleLabels: Record<string, string> = {
  user: 'Rechtsanwalt',
  admin: 'Administrator',
  partner: 'Partner',
}

const { stats, documents, deadlines, activities, loading, errors } = dashboard

const statCards = computed(() => {
  const statsValue = stats.value
  return [
    {
      key: 'cases',
      label: 'Neue Fälle',
      value: formatNumber(statsValue?.cases.new_count),
      badge: statsValue ? `${formatSigned(statsValue.cases.new_change_percent)}%` : null,
      badgeVariant: statsValue && statsValue.cases.new_change_percent >= 0 ? 'badge-success' : 'badge-danger',
      caption: 'vergangene 30 Tage',
      loading: loading.value.stats,
    },
    {
      key: 'documents',
      label: 'Dokumente',
      value: formatNumber(statsValue?.documents.total_count),
      badge: statsValue ? `${formatNumber(statsValue.documents.active_count)} aktiv` : null,
      badgeVariant: 'badge-primary',
      caption: 'gesamt in der Kanzlei',
      loading: loading.value.stats,
    },
    {
      key: 'emails',
      label: 'E-Mails',
      value: formatNumber(statsValue?.emails.total_count),
      badge: statsValue ? `${formatNumber(statsValue.emails.auto_processed)} automatisch` : null,
      badgeVariant: 'badge-primary',
      caption: 'verarbeitete Korrespondenz',
      loading: loading.value.stats,
    },
    {
      key: 'deadline',
      label: 'Nächste Frist',
      value: statsValue?.next_deadline.date ? formatDate(statsValue.next_deadline.date) : 'Keine Frist',
      badge: statsValue?.next_deadline.days_until != null ? `${statsValue.next_deadline.days_until} Tage` : null,
      badgeVariant: 'badge-warning',
      caption: statsValue?.next_deadline.title || 'Keine Fristen geplant',
      loading: loading.value.stats,
    },
  ]
})

const alertMessage = computed(() => {
  const storeError = Object.values(errors.value).find((msg) => msg)
  return storeError || lastError.value
})

function clearAlert() {
  reset()
  Object.keys(errors.value).forEach((key) => dashboard.setError(key as keyof typeof errors.value, null))
}

function formatNumber(value?: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('de-DE').format(value)
}

function formatSigned(value?: number | null) {
  if (!value) return value === 0 ? '0' : '+'
  return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatRelative(value?: string | null) {
  if (!value) return '—'
  const formatter = new Intl.RelativeTimeFormat('de', { numeric: 'auto' })
  const date = new Date(value)
  const diffMs = date.getTime() - Date.now()
  const diffHours = Math.round(diffMs / 36e5)
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour')
  }
  const diffDays = Math.round(diffHours / 24)
  return formatter.format(diffDays, 'day')
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: 'Entwurf',
    review: 'In Prüfung',
    final: 'Abgeschlossen',
    archived: 'Archiviert',
    pending: 'Offen',
    completed: 'Erledigt',
    overdue: 'Überfällig',
  }
  return map[status] || status
}

function deadlineBadge(status: string) {
  if (status === 'overdue') return 'badge-danger'
  if (status === 'completed') return 'badge-muted'
  return 'badge-warning'
}

function formatDocumentMeta(doc: { type: string; file_format: string }) {
  return `${doc.type.toUpperCase()} · ${doc.file_format.toUpperCase()}`
}

function formatActivityMeta(activity: { timestamp: string; client_name?: string | null }) {
  const timestamp = new Date(activity.timestamp).toLocaleString('de-DE')
  if (activity.client_name) return `${activity.client_name} · ${timestamp}`
  return timestamp
}

async function refreshDashboard() {
  try {
    await refreshManager.trigger()
  } catch (error) {
    capture(error)
  }
}

async function retrySection(section: 'stats' | 'documents' | 'deadlines' | 'activities') {
  try {
    dashboard.setError(section, null)
    switch (section) {
      case 'stats':
        await dashboard.loadStats(true)
        break
      case 'documents':
        await dashboard.loadDocuments(true)
        break
      case 'deadlines':
        await dashboard.loadDeadlines(true)
        break
      case 'activities':
        await dashboard.loadActivities(true)
        break
    }
  } catch (error) {
    capture(error)
  }
}

function goToAssistant() {
  router.push('/assistant')
}

watch(
  () => errors.value,
  (value) => {
    const first = Object.values(value).find((msg) => msg)
    if (first) capture(first)
  },
  { deep: true }
)

onMounted(async () => {
  try {
    await refreshManager.trigger()
  } catch (error) {
    capture(error)
  }
})
</script>


<style scoped>
.sidebar-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  transition: background 0.2s ease, color 0.2s ease;
}
.sidebar-link:hover {
  background: #f3f4f6;
  color: #111827;
}
.sidebar-link.active {
  background: linear-gradient(135deg, #5b7ce6, #4a6cd4);
  color: #fff;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-image: linear-gradient(90deg, #5b7ce6, #4a6cd4);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(91, 124, 230, 0.2);
  transition: all 0.2s ease;
}
.btn-primary:disabled {
  opacity: 0.6;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  border-color: #d1d5db;
  color: #111827;
}
.btn-secondary:disabled {
  opacity: 0.6;
}

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background: #dcfce7;
  color: #15803d;
}

.badge-primary {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-warning {
  background: #fef3c7;
  color: #b45309;
}

.badge-danger {
  background: #fee2e2;
  color: #b91c1c;
}

.badge-muted {
  background: #f3f4f6;
  color: #4b5563;
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: #edf2f7;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

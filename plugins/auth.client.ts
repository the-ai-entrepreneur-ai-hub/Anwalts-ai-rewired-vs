import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return

  const authStore = useAuthStore()

  const hydrateStatus = async (force = false) => {
    try {
      await authStore.fetchStatus(force)
    } catch (error) {
      console.warn('[auth] status check failed', error)
    }
  }

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  const scheduleRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval)
    refreshInterval = setInterval(() => {
      if (!authStore.isAuthenticated) return
      hydrateStatus(false)
    }, 60_000)
  }

  nuxtApp.hook('app:mounted', async () => {
    await hydrateStatus(true)
    scheduleRefresh()
  })

  nuxtApp.hook('page:finish', scheduleRefresh)

  nuxtApp.hook('app:beforeUnmount', () => {
    if (refreshInterval) clearInterval(refreshInterval)
    refreshInterval = null
  })
})

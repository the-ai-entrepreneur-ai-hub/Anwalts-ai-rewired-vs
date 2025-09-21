import { useAuthStore } from '~/stores/auth'

const PUBLIC_PATHS = new Set<string>([
  '/', '/privacy', '/terms', '/contact', '/changelog',
  '/test-auth', '/test-login', '/framer-preview'
])

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_PATHS.has(to.path)) return

  const queryAuth = Array.isArray(to.query.auth) ? to.query.auth[0] : to.query.auth
  if (queryAuth === 'success') return

  const authStore = useAuthStore()

  if (process.server) {
    try {
      const headers = useRequestHeaders(['cookie'])
      const status = await $fetch('/api/auth/status', {
        headers,
        credentials: 'include'
      }) as any
      if (status?.authenticated) return
    } catch (_) {
      // ignore and fall through
    }
    const target = new URL(to.fullPath, 'http://localhost')
    if (!target.searchParams.has('auth')) target.searchParams.set('auth', 'required')
    return navigateTo(target.pathname + '?' + target.searchParams.toString(), { redirectCode: 302 })
  }

  try {
    await authStore.fetchStatus(true)
    if (authStore.isAuthenticated) return
  } catch (_) {
    // ignore
  }

  authStore.setRedirect(to.fullPath)
  authStore.open('login', to.fullPath)

  const url = new URL(window.location.href)
  if (!url.searchParams.has('auth')) {
    url.searchParams.set('auth', 'required')
    window.history.replaceState({}, document.title, url.toString())
  }
  return abortNavigation()
})

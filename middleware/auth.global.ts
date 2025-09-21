import { useAuthStore } from '~/stores/auth'

const PUBLIC_ROUTES = new Set<string>([
  '/', '/privacy', '/terms', '/contact', '/changelog',
  '/landing', '/landing-alt', '/framer-preview', '/test-login', '/test-auth'
])

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_ROUTES.has(to.path)) return

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
      // ignore and fall through to redirect
    }
    const target = new URL(to.fullPath, 'http://localhost')
    if (!target.searchParams.has('auth')) target.searchParams.set('auth', 'required')
    return navigateTo(target.pathname + '?' + target.searchParams.toString(), { redirectCode: 302 })
  }

  try {
    await authStore.fetchStatus(true)
    if (authStore.isAuthenticated) return
  } catch (_) {
    // ignore, modal prompt below
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

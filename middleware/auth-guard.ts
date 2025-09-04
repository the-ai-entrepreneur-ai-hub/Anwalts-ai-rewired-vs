export default defineNuxtRouteMiddleware(async (to) => {
  // Public routes that don't require auth
  const publicPaths = new Set<string>([
    '/', '/privacy', '/terms', '/contact', '/changelog',
    '/test-auth', '/test-login', '/framer-preview'
  ])

  // Temporary bypass for demo: allow ?auth=success to view dashboard without cookies
  const q: any = to.query || {}
  if ((typeof q.auth === 'string' && q.auth === 'success') || (Array.isArray(q.auth) && q.auth.includes('success'))) {
    return
  }
  if (publicPaths.has(to.path)) return

  // Try Nuxt SSR session first, then backend session
  const ok = async (path: string) => {
    try {
      const requestHeaders = process.server ? useRequestHeaders(['cookie']) : undefined
      const res: any = await $fetch(path, {
        // On server-side, forward incoming Cookie header to API route
        headers: process.server ? requestHeaders : undefined,
        // On client-side, ensure browser includes cookies
        ...(process.client ? { credentials: 'include' as const } : {})
      })
      return !!res?.success
    } catch { return false }
  }

  const nuxtOk = await ok('/api/auth/me')
  if (nuxtOk) return

  // Not authenticated: redirect to landing
  if (process.client) return navigateTo('/?auth=required')
  return navigateTo('/', { redirectCode: 302 })
})

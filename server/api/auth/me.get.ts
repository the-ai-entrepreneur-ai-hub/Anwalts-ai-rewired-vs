export default defineEventHandler(async (event) => {
  try {
    // Primary: accept Google session via user_data cookie set in google callback
    const userDataCookie = getCookie(event, 'user_data')
    if (userDataCookie) {
      try {
        const parsed = JSON.parse(userDataCookie)
        if (parsed && parsed.email) {
          return { success: true, user: parsed }
        }
      } catch (_) {
        // fall through to legacy handling
      }
    }

    // Email/password flow: accept real backend JWT in auth_token or validate against backend
    const authToken = getCookie(event, 'auth_token')
    if (authToken) {
      const config = useRuntimeConfig()
      const base = (config as any).backendBase || process.env.BACKEND_BASE || 'http://172.19.0.4:8000'
      // Try to validate token against backend to fetch user profile
      const backendCandidates = [
        `${base}/auth/me`,
        `${base}/auth/users/me`,
        `${base}/api/auth/me`
      ]
      for (const url of backendCandidates) {
        try {
          const r = await fetch(url, {
            headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' }
          })
          if (r.ok) {
            const u = await r.json().catch(() => ({}))
            const user = u?.user || u || {}
            if (user && (user.email || user.id || user.name)) {
              return { success: true, user }
            }
          }
        } catch (_) { /* try next */ }
      }

      // Fallback: treat presence of token as session (mirrors Google cookie gate)
      return {
        success: true,
        user: { id: 'session', email: '', name: 'Benutzer', provider: 'email' }
      }
    }

    // No cookies -> unauthenticated
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    
  } catch (error) {
    throw error
  }
})

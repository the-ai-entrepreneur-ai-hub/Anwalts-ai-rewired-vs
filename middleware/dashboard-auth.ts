import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  const auth = useAuthStore()
  try {
    await auth.ensureAuthenticated({ redirect: to.fullPath })
  } catch (error) {
    if (process.client) {
      // ensure modal opens
      auth.open('login', to.fullPath)
    }
    return
  }
})

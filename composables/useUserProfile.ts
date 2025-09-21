import { ref } from 'vue'
import { fetchUserProfile } from '~/services/dashboard-api'
import type { UserProfile } from '~/types/dashboard'

export function useUserProfile() {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadProfile(force = false) {
    if (loading.value) return
    if (!force && profile.value) return

    loading.value = true
    error.value = null
    try {
      const response = await fetchUserProfile()
      profile.value = response.data
    } catch (err: any) {
      error.value = err?.data?.error?.message || err?.message || 'Profil konnte nicht geladen werden'
      throw err
    } finally {
      loading.value = false
    }
  }

  function reset() {
    profile.value = null
    error.value = null
  }

  return { profile, loading, error, loadProfile, reset }
}

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useAuthStore } from '~/stores/auth'
import { authApi } from '~/services/auth-api'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('dashboard authentication enforcement', () => {
  it('requires a valid session before loading data', async () => {
    const auth = useAuthStore()
    vi.spyOn(authApi, 'status').mockRejectedValue(new Error('unauthorized'))

    await expect(auth.ensureAuthenticated({ redirect: '/dashboard' })).rejects.toThrow(/UNAUTHORIZED/)
    expect(auth.redirectAfterAuth).toBe('/dashboard')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

const authApiMocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  status: vi.fn(),
  refresh: vi.fn(),
  debugSessions: vi.fn(),
  debugLogs: vi.fn(),
  initiateGoogleOAuth: vi.fn(),
}))

vi.mock('~/services/auth-api', () => ({
  authApi: authApiMocks,
  DEFAULT_CSRF: 'stub-csrf-token',
}))

const {
  login: mockLogin,
  logout: mockLogout,
  refresh: mockRefresh,
  status: mockStatus,
} = authApiMocks

import { setActivePinia, createPinia } from 'pinia'

import { useAuthStore } from '~/stores/auth'
import { DEFAULT_CSRF } from '~/services/auth-api'

const mockAuthResponse = () => ({
  success: true as const,
  user: {
    id: 'user-id',
    email: 'user@example.com',
    first_name: 'Unit',
    last_name: 'Test',
    login_method: 'email',
  },
  session: {
    id: 'session-id',
    expires_at: new Date(Date.now() + 3_600_000).toISOString(),
    created_at: new Date().toISOString(),
    last_accessed_at: new Date().toISOString(),
  },
  tokens: {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    expires_in: 300,
    token_type: 'Bearer',
  },
  timestamp: new Date().toISOString(),
})

beforeEach(() => {
  vi.resetAllMocks()
  setActivePinia(createPinia())
})

describe('auth store', () => {
  it('logs in and stores session state', async () => {
    const response = mockAuthResponse()
    mockLogin.mockResolvedValue(response)

    const store = useAuthStore()
    await store.login({ email: 'user@example.com', password: 'StrongPass123!' })

    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('user@example.com')
    expect(store.session?.id).toBe('session-id')
    expect(store.tokens?.access_token).toBe('access-token')
    expect(store.csrfToken).toBe(DEFAULT_CSRF)
  })

  it('handles logout and clears state', async () => {
    const response = mockAuthResponse()
    mockLogin.mockResolvedValue(response)
    mockLogout.mockResolvedValue({ success: true, timestamp: new Date().toISOString() })

    const store = useAuthStore()
    await store.login({ email: 'user@example.com', password: 'StrongPass123!' })
    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.session).toBeNull()
    expect(store.tokens).toBeNull()
  })

  it('refreshes session tokens', async () => {
    const response = mockAuthResponse()
    mockLogin.mockResolvedValue(response)
    mockRefresh.mockResolvedValue({
      ...response,
      tokens: {
        ...response.tokens,
        access_token: 'new-access-token',
      },
    })

    const store = useAuthStore()
    await store.login({ email: 'user@example.com', password: 'StrongPass123!' })
    await store.refreshSession()

    expect(mockRefresh).toHaveBeenCalledWith({ csrfToken: DEFAULT_CSRF })
    expect(store.tokens?.access_token).toBe('new-access-token')
  })

  it('fetchStatus clears auth when unauthorized', async () => {
    mockStatus.mockRejectedValue(new Error('unauthorized'))

    const store = useAuthStore()
    await store.fetchStatus(true)

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.session).toBeNull()
  })
})

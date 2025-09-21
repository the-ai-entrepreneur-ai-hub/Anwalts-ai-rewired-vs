export const DEFAULT_CSRF = 'stub-csrf-token'

export interface AuthUser {
  id: string
  email: string
  email_verified?: boolean
  first_name?: string
  last_name?: string
  title?: string
  firm_name?: string
  login_method?: string
}

export interface AuthSession {
  id: string
  expires_at: string | null
  created_at: string
  last_accessed_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token?: string | null
  expires_in: number
  token_type: string
}

export interface AuthSuccessResponse {
  success: true
  user: AuthUser
  session: AuthSession
  tokens: AuthTokens
  timestamp: string
}

export interface AuthStatusResponse {
  authenticated: boolean
  user?: AuthUser
  session?: AuthSession
  csrf_token?: string
  timestamp: string
}

export interface AuthErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  timestamp: string
}

interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
  csrfToken?: string
  deviceFingerprint?: string | null
}

interface RegisterPayload {
  email: string
  password: string
  first_name: string
  last_name: string
  title: string
  firm_name: string
  terms_accepted: boolean
  csrfToken?: string
}

interface RefreshPayload {
  csrfToken?: string
}

interface LogoutPayload {
  csrfToken?: string
}

export const authApi = {
  async login(payload: LoginPayload) {
    return $fetch<AuthSuccessResponse>('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      body: {
        email: payload.email,
        password: payload.password,
        remember_me: payload.rememberMe ?? false,
        csrf_token: payload.csrfToken || DEFAULT_CSRF,
        device_fingerprint: payload.deviceFingerprint || null
      }
    })
  },
  async register(payload: RegisterPayload) {
    return $fetch<AuthSuccessResponse>('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: {
        email: payload.email,
        password: payload.password,
        first_name: payload.first_name,
        last_name: payload.last_name,
        title: payload.title,
        firm_name: payload.firm_name,
        terms_accepted: payload.terms_accepted,
        csrf_token: payload.csrfToken || DEFAULT_CSRF
      }
    })
  },
  async refresh(payload: RefreshPayload = {}) {
    return $fetch<AuthSuccessResponse>('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      body: { csrf_token: payload.csrfToken || DEFAULT_CSRF }
    })
  },
  async logout(payload: LogoutPayload = {}) {
    return $fetch<{ success: boolean; message?: string; timestamp: string } | AuthErrorResponse>('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      body: { csrf_token: payload.csrfToken || DEFAULT_CSRF }
    })
  },
  async status() {
    return $fetch<AuthStatusResponse>('/api/auth/status', { credentials: 'include' })
  },
  async debugSessions(params: { user_id?: string; active_only?: boolean } = {}) {
    return $fetch('/api/auth/debug/sessions', {
      credentials: 'include',
      query: params
    })
  },
  async debugLogs(params: { user_id?: string; event_type?: string } = {}) {
    return $fetch('/api/auth/debug/logs', {
      credentials: 'include',
      query: params
    })
  },
  async initiateGoogleOAuth(redirectUri: string, state?: string) {
    return $fetch<{ auth_url: string; state: string; expires_at: string } | AuthErrorResponse>('/api/auth/oauth/google/initiate', {
      method: 'POST',
      credentials: 'include',
      body: {
        redirect_uri: redirectUri,
        state: state ?? null
      }
    })
  }
}

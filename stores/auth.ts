import { defineStore } from 'pinia'
import { navigateTo } from '#app'
import { authApi, DEFAULT_CSRF, type AuthSession, type AuthSuccessResponse, type AuthTokens } from '~/services/auth-api'

type AuthView = 'login' | 'register'

interface UserProfile {
  id?: string
  email?: string
  first_name?: string
  last_name?: string
  firm_name?: string
  title?: string
  role?: string
  name?: string
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserProfile | null
  session: AuthSession | null
  tokens: AuthTokens | null
  csrfToken: string | null
  sessionExpiresAt: string | null
  authError: string | null
  showAuthModal: boolean
  authModalView: AuthView
  isSubmitting: boolean
  redirectAfterAuth: string
  lastStatusCheck: number | null
}

function extractErrorMessage(err: any, fallback: string) {
  if (err?.data?.error?.message) return err.data.error.message
  if (err?.data?.statusMessage) return err.data.statusMessage
  if (err?.data?.message) return err.data.message
  if (err?.data?.detail?.message) return err.data.detail.message
  if (err?.message) return err.message
  return fallback
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    session: null,
    tokens: null,
    csrfToken: null,
    sessionExpiresAt: null,
    authError: null,
    showAuthModal: false,
    authModalView: 'login',
    isSubmitting: false,
    redirectAfterAuth: '/dashboard',
    lastStatusCheck: null,
  }),
  actions: {
    open(view: AuthView = 'login', redirect?: string) {
      this.authModalView = view
      this.showAuthModal = true
      this.authError = null
      if (redirect) this.redirectAfterAuth = redirect
    },
    setView(next: AuthView) {
      this.authModalView = next
      this.authError = null
    },
    close() {
      this.showAuthModal = false
      this.authError = null
    },
    setRedirect(path: string) {
      this.redirectAfterAuth = path || '/dashboard'
    },
    async fetchStatus(force = false) {
      if (this.isSubmitting) return
      if (!force && this.lastStatusCheck && Date.now() - this.lastStatusCheck < 30_000) return
      this.isLoading = true
      this.authError = null
      try {
        const res = await authApi.status()
        this.isAuthenticated = !!res?.authenticated
        this.user = res?.user || null
        this.session = res?.session || null
        this.tokens = this.isAuthenticated ? this.tokens : null
        this.sessionExpiresAt = res?.session?.expires_at || null
        if (res?.csrf_token) this.csrfToken = res.csrf_token
        else if (this.isAuthenticated && !this.csrfToken) this.csrfToken = DEFAULT_CSRF
      } catch (err) {
        this.isAuthenticated = false
        this.user = null
        this.session = null
        this.tokens = null
        this.csrfToken = null
        if (force) this.authError = extractErrorMessage(err, 'Sitzung konnte nicht geprüft werden')
      } finally {
        this.isLoading = false
        this.lastStatusCheck = Date.now()
      }
    },
    async ensureAuthenticated(options: { redirect?: string } = {}) {
      if (!this.isAuthenticated) {
        await this.fetchStatus(true)
      }
      if (!this.isAuthenticated) {
        if (options.redirect) this.setRedirect(options.redirect)
        this.open('login', options.redirect)
        throw new Error('UNAUTHORIZED')
      }
    },
    async login(payload: { email: string; password: string; remember?: boolean }) {
      this.isSubmitting = true
      this.authError = null
      try {
        const res = await authApi.login({
          email: payload.email,
          password: payload.password,
          rememberMe: payload.remember,
          csrfToken: this.csrfToken || DEFAULT_CSRF,
        })
        this.applyAuthResponse(res)
        await this.afterAuthSuccess()
      } catch (err) {
        this.authError = extractErrorMessage(err, 'Login fehlgeschlagen')
        throw err
      } finally {
        this.isSubmitting = false
      }
    },
    async register(payload: {
      email: string
      password: string
      first_name: string
      last_name: string
      title: string
      firm_name: string
      terms_accepted: boolean
    }) {
      this.isSubmitting = true
      this.authError = null
      try {
        const res = await authApi.register({
          email: payload.email,
          password: payload.password,
          first_name: payload.first_name,
          last_name: payload.last_name,
          title: payload.title,
          firm_name: payload.firm_name,
          terms_accepted: payload.terms_accepted,
          csrfToken: DEFAULT_CSRF,
        })
        this.applyAuthResponse(res)
        await this.afterAuthSuccess()
      } catch (err) {
        this.authError = extractErrorMessage(err, 'Registrierung fehlgeschlagen')
        throw err
      } finally {
        this.isSubmitting = false
      }
    },
    async loginWithGoogle() {
      try {
        const redirectUri = `${window.location.origin}/api/auth/google/callback`
        const res = await authApi.initiateGoogleOAuth(redirectUri)
        if ('auth_url' in res && res.auth_url) {
          window.location.href = res.auth_url
          return
        }
      } catch (err) {
        console.error('Google OAuth start failed', err)
        this.authError = extractErrorMessage(err, 'Google Anmeldung nicht verfügbar')
      }
    },
    async logout() {
      try {
        await authApi.logout({ csrfToken: this.csrfToken || DEFAULT_CSRF })
      } finally {
        this.resetState()
      }
    },
    async refreshSession() {
      try {
        const csrfToken = this.csrfToken || DEFAULT_CSRF
        const res = await authApi.refresh({ csrfToken })
        this.applyAuthResponse(res)
        return res
      } catch (err) {
        this.resetState()
        throw err
      }
    },
    applyAuthResponse(data: AuthSuccessResponse, csrfToken?: string) {
      this.isAuthenticated = true
      this.user = data.user
      this.session = data.session
      this.sessionExpiresAt = data.session?.expires_at || null
      this.tokens = data.tokens
      if (csrfToken) this.csrfToken = csrfToken
      else if (!this.csrfToken) this.csrfToken = DEFAULT_CSRF
    },
    resetState() {
      this.isAuthenticated = false
      this.user = null
      this.session = null
      this.tokens = null
      this.sessionExpiresAt = null
      this.csrfToken = null
      this.showAuthModal = false
      this.authModalView = 'login'
    },
    async afterAuthSuccess() {
      await this.fetchStatus(true)
      this.close()
      const target = this.redirectAfterAuth || '/dashboard'
      this.setRedirect('/dashboard')
      if (process.client) {
        await navigateTo(target)
      }
    },
  },
})

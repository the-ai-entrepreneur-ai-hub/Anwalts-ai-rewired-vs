export default defineEventHandler(async (event) => {
  // Google OAuth 2.0 Authorization Endpoint
  const host = getHeader(event, 'host') || ''
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const clientId = process.env.GOOGLE_CLIENT_ID || (globalThis as any).GOOGLE_CLIENT_ID
  // Use explicit env redirect if provided; default to /auth/google/callback
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || (globalThis as any).GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`

  if (!clientId) {
    console.error('Missing GOOGLE_CLIENT_ID in environment')
    await sendRedirect(event, '/assistant?auth=google&error=missing_client_id', 302)
    return
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  await sendRedirect(event, authUrl.toString(), 302)
})
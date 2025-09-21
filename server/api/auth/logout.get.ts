import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    const cookies = getHeader(event, 'cookie')
    if (cookies) headers.Cookie = cookies

    const backendUrl = buildBackendUrl(event, '/api/auth/logout')

    await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ csrf_token: 'stub-csrf-token' }),
    })
  } catch (err) {
    console.warn('Logout GET proxy failed', err)
  }

  const host = getHeader(event, 'host') || ''
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  try {
    setCookie(event, 'user_data', '', {
      path: '/',
      httpOnly: false,
      secure: !isLocal,
      sameSite: !isLocal ? 'none' : 'lax',
      maxAge: 0,
    })
  } catch {}

  return sendRedirect(event, '/', 302)
})

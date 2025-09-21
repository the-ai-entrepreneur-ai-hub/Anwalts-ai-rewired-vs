import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  const backendUrl = buildBackendUrl(event, '/api/auth/logout')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  const cookies = getHeader(event, 'cookie')
  if (cookies) headers.Cookie = cookies

  const body = await readBody(event)

  const backendResponse = await fetch(backendUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body ?? { csrf_token: 'stub-csrf-token' }),
  }).catch((err) => {
    console.error('Logout proxy error', err)
    throw createError({ statusCode: 502, statusMessage: 'Logout service unavailable' })
  })

  const rawCookies = (backendResponse.headers as any).raw?.()['set-cookie'] || backendResponse.headers.get('set-cookie')
  if (rawCookies) {
    event.node.res.setHeader('set-cookie', Array.isArray(rawCookies) ? rawCookies : [rawCookies])
  }

  event.node.res.statusCode = backendResponse.status

  const text = await backendResponse.text()
  let result: any = {}
  if (text) {
    try {
      result = JSON.parse(text)
    } catch (err) {
      console.warn('Auth logout: failed to parse backend response', err)
    }
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

  if (!backendResponse.ok) {
    const message = result?.error?.message || result?.message || 'Logout failed'
    throw createError({ statusCode: backendResponse.status || 500, statusMessage: message })
  }

  return result
})

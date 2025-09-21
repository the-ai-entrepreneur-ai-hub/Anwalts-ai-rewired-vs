import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  const backendUrl = buildBackendUrl(event, '/api/auth/refresh')

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
    console.error('Refresh proxy error', err)
    throw createError({ statusCode: 502, statusMessage: 'Authentication service unavailable' })
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
      console.warn('Auth refresh: failed to parse backend response', err)
    }
  }

  if (!backendResponse.ok || result?.success === false) {
    const message = result?.error?.message || result?.message || 'Refresh failed'
    throw createError({ statusCode: backendResponse.status || 401, statusMessage: message })
  }

  return result
})

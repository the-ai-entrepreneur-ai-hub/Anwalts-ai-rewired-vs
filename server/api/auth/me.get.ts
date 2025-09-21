import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  const backendUrl = buildBackendUrl(event, '/api/auth/status')

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  const cookies = getHeader(event, 'cookie')
  if (cookies) headers.Cookie = cookies

  const backendResponse = await fetch(backendUrl, { headers }).catch((err) => {
    console.error('Auth me proxy error', err)
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
      console.warn('Auth me: failed to parse backend response', err)
    }
  }

  if (!backendResponse.ok || result?.authenticated === false) {
    const message = result?.error?.message || result?.message || 'Not authenticated'
    throw createError({ statusCode: backendResponse.status || 401, statusMessage: message })
  }

  return { success: true, user: result?.user || null }
})

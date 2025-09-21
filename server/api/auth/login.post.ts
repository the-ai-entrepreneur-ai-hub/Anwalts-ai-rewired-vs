import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = body?.email?.trim?.()
    const password = body?.password

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
    }

    const backendUrl = buildBackendUrl(event, '/api/auth/login')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    const incomingCookies = getHeader(event, 'cookie')
    if (incomingCookies) headers.Cookie = incomingCookies

    const payload = {
      email,
      password,
      remember_me: !!body?.remember_me,
      csrf_token: body?.csrf_token || 'stub-csrf-token',
      device_fingerprint: body?.device_fingerprint ?? null,
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error('❌ Authentication service unreachable', err)
      throw createError({ statusCode: 502, statusMessage: 'Authentication service unavailable' })
    })

    const rawCookies = (backendResponse.headers as any).raw?.()['set-cookie'] || backendResponse.headers.get('set-cookie')
    if (rawCookies) {
      event.node.res.setHeader('set-cookie', Array.isArray(rawCookies) ? rawCookies : [rawCookies])
    }

    const text = await backendResponse.text()
    let result: any = {}
    if (text) {
      try {
        result = JSON.parse(text)
      } catch (err) {
        console.warn('Auth login: failed to parse backend response', err)
      }
    }

    event.node.res.statusCode = backendResponse.status

    if (!backendResponse.ok || result?.success === false) {
      const message = result?.error?.message || result?.error?.code || result?.message || 'Invalid email or password'
      throw createError({ statusCode: backendResponse.status || 401, statusMessage: message })
    }

    if (result?.user) {
      const host = getHeader(event, 'host') || ''
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
      setCookie(event, 'user_data', JSON.stringify(result.user), {
        path: '/',
        httpOnly: false,
        secure: !isLocal,
        sameSite: !isLocal ? 'none' : 'lax',
        maxAge: 60 * 60,
      })
    }

    return result
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
})

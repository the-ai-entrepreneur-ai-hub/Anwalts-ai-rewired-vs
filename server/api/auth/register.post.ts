import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = body?.email?.trim?.()
    const password = body?.password
    const firstName = body?.first_name?.trim?.()
    const lastName = body?.last_name?.trim?.()
    const title = body?.title?.trim?.()
    const firmName = body?.firm_name?.trim?.()
    const termsAccepted = Boolean(body?.terms_accepted)

    if (!email || !password || !firstName || !lastName || !title || !firmName) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required registration fields' })
    }
    if (!termsAccepted) {
      throw createError({ statusCode: 400, statusMessage: 'Terms must be accepted' })
    }

    const backendUrl = buildBackendUrl(event, '/api/auth/register')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    const incomingCookies = getHeader(event, 'cookie')
    if (incomingCookies) headers.Cookie = incomingCookies

    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      title,
      firm_name: firmName,
      terms_accepted: termsAccepted,
      csrf_token: body?.csrf_token || 'stub-csrf-token',
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error('❌ Registration service unreachable', err)
      throw createError({ statusCode: 502, statusMessage: 'Registration service unavailable' })
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
        console.warn('Auth register: failed to parse backend response', err)
      }
    }

    event.node.res.statusCode = backendResponse.status

    if (!backendResponse.ok || result?.success === false) {
      const message = result?.error?.message || result?.error?.code || result?.message || 'Registration failed'
      throw createError({ statusCode: backendResponse.status || 400, statusMessage: message })
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
    console.error('Registration error:', error)
    throw error
  }
})

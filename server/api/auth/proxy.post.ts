export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const path: string = body?.path || ''
    const method: string = (body?.method || 'POST').toUpperCase()
    const payload = body?.body || {}
    if (!path || !/^\/api\//.test(path)) {
      setResponseStatus(event, 400)
      return { error: 'Invalid path' }
    }
    const config = useRuntimeConfig()
    const backendBase = (config as any).backendBase || process.env.BACKEND_BASE || 'http://172.19.0.4:8000'
    const backendUrl = backendBase + path.replace(/^\/api\//, '/api/')

    const incomingAuth = getHeader(event, 'authorization')
    const cookieToken = getCookie(event, 'auth_token')
    const headers: any = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    if (incomingAuth) headers['Authorization'] = incomingAuth
    else if (cookieToken) headers['Authorization'] = `Bearer ${cookieToken}`

    const res = await fetch(backendUrl, { method, headers, body: JSON.stringify(payload) })
    const text = await res.text()
    setResponseStatus(event, res.status)
    try { return JSON.parse(text) } catch { return text }
  } catch (e: any) {
    setResponseStatus(event, 500)
    return { error: String(e) }
  }
})

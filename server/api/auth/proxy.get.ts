export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event)
    const p = typeof q.path === 'string' ? q.path : ''
    if (!p || !/^\/api\//.test(p)) { setResponseStatus(event, 400); return { error: 'Invalid path' } }
    const config = useRuntimeConfig()
    const backendBase = (config as any).backendBase || process.env.BACKEND_BASE || 'http://172.19.0.4:8000'
    const backendUrl = backendBase + p.replace(/^\/api\//, '/api/')
    const authToken = getCookie(event, 'auth_token')
    const headers: any = { 'Accept': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`
    const res = await fetch(backendUrl, { headers })
    const buf = await res.arrayBuffer()
    setResponseStatus(event, res.status)
    setHeader(event, 'Content-Type', res.headers.get('content-type') || 'application/octet-stream')
    return send(event, Buffer.from(buf))
  } catch (e: any) { setResponseStatus(event, 500); return { error: String(e) } }
})

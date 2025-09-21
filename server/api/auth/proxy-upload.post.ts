import { buildBackendUrl } from '~/server/utils/backend'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) { setResponseStatus(event, 400); return { error: 'No form data' } }
    const filePart = formData.find(p => p.type === 'file')
    if (!filePart || !filePart.data || !filePart.filename) { setResponseStatus(event, 400); return { error: 'No file' } }

    const boundary = '----anwaltsproxy' + Math.random().toString(36).slice(2)
    const chunks: any[] = []
    const push = (s: string | Buffer) => chunks.push(typeof s === 'string' ? Buffer.from(s) : s)

    push(`--${boundary}\r\n`)
    push(`Content-Disposition: form-data; name=file; filename=${filePart.filename}\r\n`)
    push(`Content-Type: ${filePart.type || 'application/octet-stream'}\r\n\r\n`)
    push(filePart.data)
    push(`\r\n--${boundary}--\r\n`)

    const authToken = getCookie(event, 'auth_token')
    const headers: any = { 'Content-Type': `multipart/form-data; boundary=${boundary}` }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    const backendUrl = buildBackendUrl(event, '/api/files/upload')
    const res = await fetch(backendUrl, { method: 'POST', headers, body: Buffer.concat(chunks) })
    const text = await res.text()
    setResponseStatus(event, res.status)
    try { return JSON.parse(text) } catch { return text }
  } catch (e: any) { setResponseStatus(event, 500); return { error: String(e) } }
})

export default defineEventHandler(async (event) => {
  try {
    const host = getHeader(event, 'host') || ''
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1')

    // Expire cookies we set during auth
    const common = { secure: !isLocal, sameSite: 'none' as const, path: '/' }
    try { setCookie(event, 'auth_token', '', { ...common, httpOnly: true, maxAge: 0 }) } catch {}
    try { setCookie(event, 'user_data', '', { ...common, httpOnly: false, maxAge: 0 }) } catch {}
  } catch {}
  return { success: true }
})

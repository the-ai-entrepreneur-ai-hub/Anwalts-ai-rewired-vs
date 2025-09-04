export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('🔐 Login attempt:', { email: body.email })

    const config = useRuntimeConfig()
    const backendBase = (config as any).backendBase || process.env.BACKEND_BASE || 'http://172.19.0.4:8000'
    const backendUrl = `${backendBase}/auth/login-working`

    try {
      const backendResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password
        })
      })
      
      const result = await backendResponse.json()
      // Normalize token field across possible backend shapes
      const normalizedToken = result?.token || result?.access_token || result?.data?.token || result?.data?.access_token || null
      
      if ((result.success === true || backendResponse.ok) && result.user) {
        console.log('✅ Backend login successful for:', result.user.email)
        
        // Set auth cookie with real JWT token from backend
        const host = getHeader(event, 'host') || ''
        const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
        if (normalizedToken) {
          setCookie(event, 'auth_token', String(normalizedToken), {
            httpOnly: true,
            secure: !isLocal,
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
        }
        // Mirror Google flow: set non-HTTPOnly user_data for SSR/client session
        try {
          setCookie(event, 'user_data', JSON.stringify({
            id: result.user.id || result.user.user_id || result.user.email || 'user',
            email: result.user.email,
            name: result.user.name || result.user.full_name || '',
            picture: result.user.picture || '',
            provider: 'email'
          }), {
            httpOnly: false,
            secure: !isLocal,
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
          })
        } catch (e) {
          console.warn('Could not set user_data cookie:', e)
        }
        
        return {
          success: true,
          user: result.user,
          token: normalizedToken,
          message: 'Login successful'
        }
      } else {
        console.log('❌ Backend authentication failed:', result.error)
        throw createError({
          statusCode: 401,
          statusMessage: result.error || 'Invalid email or password'
        })
      }
    } catch (backendError: any) {
      console.error('❌ Backend connection error:', backendError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication service unavailable'
      })
    }
    
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { message_id, feedback_type, message_content, timestamp } = body

    // Validate input
    if (!message_id || !message_content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: message_id, message_content'
      })
    }

    const validFeedbackTypes = ['positive', 'negative', 'accepted', 'rejected', null]
    if (feedback_type !== null && !validFeedbackTypes.includes(feedback_type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid feedback_type. Must be one of: positive, negative, accepted, rejected, or null'
      })
    }

    // Get runtime config for backend
    const config = useRuntimeConfig()
    const backendBase = config.backendBase || 'http://127.0.0.1:8000'

    // Forward to FastAPI backend
    const response = await $fetch(`${backendBase}/api/ai/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth headers
        ...getAuthHeaders(event)
      },
      body: {
        message_id,
        feedback_type,
        message_content,
        timestamp: timestamp || new Date().toISOString(),
        user_agent: getHeader(event, 'user-agent'),
        ip_address: getClientIP(event)
      }
    })

    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: response
    }

  } catch (error: any) {
    console.error('Feedback API error:', error)

    // Handle different error types
    if (error.statusCode) {
      throw error
    }

    if (error.response?.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    if (error.response?.status === 403) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while submitting feedback'
    })
  }
})

// Helper function to extract auth headers
function getAuthHeaders(event: any) {
  const headers: Record<string, string> = {}
  
  // Check for Authorization header
  const authHeader = getHeader(event, 'authorization')
  if (authHeader) {
    headers.Authorization = authHeader
  }

  // Check for cookies that might contain auth tokens
  const cookies = parseCookies(event)
  const tokenKeys = ['access_token', 'token', 'sat', 'anwalts_auth_token']
  
  for (const key of tokenKeys) {
    if (cookies[key]) {
      headers.Authorization = `Bearer ${cookies[key]}`
      break
    }
  }

  return headers
}
export default defineEventHandler(async (event) => {
  // Simple test auth endpoint with default user
  const testUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    provider: 'test'
  }
  
  console.log('Test auth endpoint hit')
  
  // Set auth cookie for testing
  setCookie(event, 'auth_token', 'test-token-123', {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  
  // Redirect to dashboard with auth success
  await sendRedirect(event, '/dashboard?auth_success=true&provider=test&demo=true', 302)
})
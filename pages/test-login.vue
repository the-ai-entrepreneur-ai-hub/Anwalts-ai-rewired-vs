<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8 text-center">🔐 AUTH TESTING PAGE</h1>
      
      <!-- Test Credentials -->
      <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">📋 Available Test Credentials</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-500/20 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-white">Admin User</h3>
            <p class="text-green-200">Email: <code>admin@example.com</code></p>
            <p class="text-green-200">Password: <code>StrongPass123!</code></p>
            <p class="text-sm text-green-300">Role: Administrator</p>
          </div>
          
          <div class="bg-blue-500/20 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-white">Demo User</h3>
            <p class="text-blue-200">Email: <code>user@example.com</code></p>
            <p class="text-blue-200">Password: <code>StrongPass123!</code></p>
            <p class="text-sm text-blue-300">Role: User</p>
          </div>
          
          <div class="bg-purple-500/20 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-white">Regular User</h3>
            <p class="text-purple-200">Email: <code>session-user@example.com</code></p>
            <p class="text-purple-200">Password: <code>StrongPass123!</code></p>
            <p class="text-sm text-purple-300">Role: Session Test</p>
          </div>
          
          <div class="bg-orange-500/20 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-white">Test User</h3>
            <p class="text-orange-200">Email: <code>refresh-user@example.com</code></p>
            <p class="text-orange-200">Password: <code>StrongPass123!</code></p>
            <p class="text-sm text-orange-300">Role: Refresh Flow</p>
          </div>
        </div>
      </div>
      
      <!-- Login Form -->
      <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">🔑 Test Login Form</h2>
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <AuthLoginForm @success="handleLoginSuccess" @error="handleLoginError" />
          <div class="mt-6">
            <OAuthLogin @error="handleLoginError" />
          </div>
        </div>
        
        <div v-if="result" class="mt-4 p-4 rounded-lg" :class="result.success ? 'bg-green-500/20' : 'bg-red-500/20'">
          <pre class="text-white text-sm">{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- Quick Test Buttons -->
      <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">⚡ Quick Tests</h2>
        <div class="grid md:grid-cols-4 gap-4">
          <button @click="quickLogin('admin@example.com')" class="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Test Admin
          </button>
          <button @click="quickLogin('user@example.com')" class="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Test User
          </button>
          <button @click="quickLogin('session-user@example.com')" class="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            Session Flow
          </button>
          <button @click="quickWrong" class="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
            Test Wrong
          </button>
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
        <h2 class="text-2xl font-bold text-white mb-4">🧭 Navigation</h2>
        <div class="flex gap-4">
          <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            ← Back to Landing
          </NuxtLink>
          <NuxtLink to="/dashboard" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Dashboard →
          </NuxtLink>
          <NuxtLink to="/test-auth" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Button Tests
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const result = ref(null)
const authStore = useAuthStore()
const router = useRouter()

const handleLoginSuccess = () => {
  result.value = {
    success: true,
    user: authStore.user,
    session: authStore.session,
    tokens: authStore.tokens,
  }
  setTimeout(() => {
    router.push('/dashboard')
  }, 800)
}

const handleLoginError = (message: string) => {
  result.value = {
    success: false,
    message,
  }
}

const quickLogin = async (email: string) => {
  try {
    await authStore.login({ email, password: 'StrongPass123!' })
    handleLoginSuccess()
  } catch (error) {
    handleLoginError(authStore.authError || 'Schnelltest fehlgeschlagen')
  }
}

const quickWrong = async () => {
  try {
    await authStore.login({ email: 'wrong@example.com', password: 'wrong' })
  } catch (error) {
    handleLoginError(authStore.authError || 'Falsche Zugangsdaten erkannt')
  }
}

onMounted(() => {
  console.log('🧪 LOGIN TEST PAGE LOADED')
  console.log('📋 Available credentials:')
  console.log('Admin: admin@example.com / StrongPass123!')
  console.log('User: user@example.com / StrongPass123!')
  console.log('Session: session-user@example.com / StrongPass123!')
  console.log('Refresh: refresh-user@example.com / StrongPass123!')
})
</script>

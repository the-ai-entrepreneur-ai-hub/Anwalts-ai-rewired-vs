<template>
  <div class="flex items-center gap-1 mt-2">
    <!-- Retry Icon -->
    <button
      @click="handleRetry"
      :disabled="isLoading"
      class="p-1.5 rounded-md hover:bg-gray-100 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
      title="Neu generieren"
    >
      <svg class="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 20v-5h-5" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9a7 7 0 0112-4.9L20 8" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 15a7 7 0 01-12 4.9L4 16" />
      </svg>
    </button>

    <!-- Copy Icon -->
    <button
      @click="handleCopy"
      class="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
      title="Kopieren"
    >
      <svg v-if="!copied" class="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      <svg v-else class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </button>

    <!-- Thumbs Up Icon -->
    <button
      @click="() => handleFeedback('positive')"
      class="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
      :class="{ 'bg-green-50': feedback === 'positive' }"
      title="Hilfreich"
    >
      <svg class="w-4 h-4" :class="feedback === 'positive' ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
      </svg>
    </button>

    <!-- Thumbs Down Icon -->
    <button
      @click="() => handleFeedback('negative')"
      class="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
      :class="{ 'bg-red-50': feedback === 'negative' }"
      title="Nicht hilfreich"
    >
      <svg class="w-4 h-4" :class="feedback === 'negative' ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
      </svg>
    </button>

    <!-- Accept/Good Icon -->
    <button
      @click="() => handleFeedback('accepted')"
      class="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
      :class="{ 'bg-blue-50': feedback === 'accepted' }"
      title="Akzeptieren"
    >
      <svg class="w-4 h-4" :class="feedback === 'accepted' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>

    <!-- Reject Icon -->
    <button
      @click="() => handleFeedback('rejected')"
      class="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
      :class="{ 'bg-orange-50': feedback === 'rejected' }"
      title="Ablehnen"
    >
      <svg class="w-4 h-4" :class="feedback === 'rejected' ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  messageId: string
  messageContent: string
  initialFeedback?: string | null
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialFeedback: null,
  isLoading: false
})

const emit = defineEmits<{
  retry: []
  feedback: [type: string]
}>()

const feedback = ref<string | null>(props.initialFeedback)
const copied = ref(false)

const config = useRuntimeConfig()

const apiBase = () => {
  const base = config.public?.apiBase || '/api'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null

  try {
    const tokenKeys = ['access_token', 'token', 'sat', 'anwalts_auth_token']
    for (const key of tokenKeys) {
      const value = window.localStorage?.getItem(key)
      if (value) return value
    }
  } catch (_error) {
    // Access to storage can fail in strict privacy modes; ignore and fall back to cookies.
  }

  if (typeof document !== 'undefined') {
    const cookies = document.cookie ? document.cookie.split('; ') : []
    const tokenKeys = ['access_token', 'token', 'sat', 'anwalts_auth_token']
    for (const key of tokenKeys) {
      const match = cookies.find(entry => entry.startsWith(`${encodeURIComponent(key)}=`))
      if (match) {
        const [, rawValue] = match.split('=')
        if (rawValue) return decodeURIComponent(rawValue)
      }
    }
  }

  return null
}

const authHeaders = () => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const handleRetry = () => {
  emit('retry')
}

const handleCopy = async () => {
  if (typeof window === 'undefined') return

  const text = props.messageContent

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
      return
    } catch (error) {
      console.warn('Clipboard copy failed, falling back to legacy approach:', error)
    }
  }

  if (typeof document === 'undefined') return

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Fallback copy failed:', error)
  }
}

const handleFeedback = async (type: string) => {
  const newFeedback = feedback.value === type ? null : type
  feedback.value = newFeedback
  
  // Send feedback to backend
  try {
    await $fetch(`${apiBase()}/ai/feedback`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: {
        message_id: props.messageId,
        feedback_type: newFeedback,
        message_content: props.messageContent,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    // Revert feedback state on error
    feedback.value = props.initialFeedback
  }

  emit('feedback', newFeedback || 'removed')
}
</script>
<template>
  <div class="p-6 md:p-8 lg:p-12">
    <!-- Back to Dashboard Button -->
    <div class="mb-6">
      <button
        @click="$router.push('/dashboard')"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Zurück zur Übersicht
      </button>
    </div>

    <div class="bg-white text-black/80 w-full overflow-hidden rounded-2xl border border-gray-200 h-[calc(100vh-12rem)]">
      <!-- Header -->
      <div class="flex flex-col gap-3 border-b border-gray-200 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-medium tracking-tight">KI-Assistent</h1>
          <p class="mt-1 text-sm text-gray-600 md:text-base">
            Ihr deutscher Rechtsassistent mit KI-Unterstützung
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="clearChat"
            class="h-10 px-4 rounded-xl border border-[#5b7ce6] bg-white text-[#5b7ce6] hover:bg-[#5b7ce6]/10 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Löschen
          </button>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div class="flex-1 overflow-y-auto p-6" style="height: calc(100% - 180px);" ref="messagesContainer">
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-[#5b7ce6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.481L3 21l2.519-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Willkommen beim KI-Assistenten</h3>
            <p class="text-sm text-gray-600">Stellen Sie rechtliche Fragen oder bitten Sie um Hilfe bei Dokumenten.</p>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="(message, index) in messages" :key="index" class="flex gap-4" :class="{ 'flex-row-reverse': message.role === 'user' }">
            <div class="flex-shrink-0">
              <div v-if="message.role === 'assistant'" class="w-8 h-8 bg-[#5b7ce6] rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div v-else class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1 max-w-3xl">
              <div
                class="rounded-2xl px-4 py-3 text-sm"
                :class="message.role === 'user' ? 'bg-[#5b7ce6] text-white' : 'bg-gray-100 text-gray-900'"
              >
                <div v-html="formatMessage(message.content)"></div>
              </div>
              <!-- Professional Feedback Icons -->
              <div v-if="message.role === 'assistant'" class="mt-2">
                <ChatMessageFeedback
                  :message-id="message.id"
                  :message-content="message.content"
                  :initial-feedback="message.feedback"
                  :is-loading="isLoading"
                  @retry="retryAssistantMessage(index)"
                  @feedback="handleFeedbackChange(index, $event)"
                />
              </div>
              <div
                v-if="message.role === 'assistant'"
                class="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500"
              >
                <span>{{ formatTime(message.timestamp) }}</span>
              </div>
              <div
                v-else
                class="mt-1 text-xs text-gray-500 text-right"
              >
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex gap-4 mt-6">
          <div class="w-8 h-8 bg-[#5b7ce6] rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="flex-1 max-w-3xl">
            <div class="bg-gray-100 rounded-2xl px-4 py-3 text-sm">
              <div class="flex items-center gap-2">
                <div class="animate-pulse flex space-x-1">
                  <div class="w-2 h-2 bg-[#5b7ce6] rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-[#5b7ce6] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-[#5b7ce6] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-gray-600">KI-Assistent denkt nach...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-gray-200 p-6">
        <form @submit.prevent="sendMessage" class="flex gap-3">
          <input
            v-model="currentMessage"
            :disabled="isLoading"
            placeholder="Stellen Sie eine rechtliche Frage..."
            class="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5b7ce6] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            :disabled="isLoading || !currentMessage.trim()"
            class="px-6 py-3 bg-[#5b7ce6] text-white rounded-xl hover:bg-[#4a6cd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Senden
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ChatMessageFeedback from '~/components/ChatMessageFeedback.vue'

const config = useRuntimeConfig()

type FeedbackValue = 'up' | 'down' | null

type MessageRole = 'user' | 'assistant'

interface Message {
  role: MessageRole
  content: string
  timestamp: Date
  feedback: FeedbackValue
  id: string
}

const messages = ref<Message[]>([])
const currentMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Generate unique message ID
const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const tokenKeys = ['access_token', 'token', 'sat', 'anwalts_auth_token']

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null

  try {
    for (const key of tokenKeys) {
      const value = window.localStorage?.getItem(key)
      if (value) return value
    }
  } catch (_error) {
    // Access to storage can fail in strict privacy modes; ignore and fall back to cookies.
  }

  if (typeof document !== 'undefined') {
    const cookies = document.cookie ? document.cookie.split('; ') : []
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

const apiBase = () => {
  const base = config.public?.apiBase || '/api'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

const assistantEmptyFallback = 'Entschuldigung, ich konnte keine Antwort generieren.'
const assistantErrorMessage = 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage. Bitte versuchen Sie es später erneut.'

const requestAssistantResponse = async (prompt: string) => {
  const endpoint = `${apiBase()}/ai/complete`
  const response = await $fetch<{ content?: string }>(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: {
      prompt,
      context_type: 'legal_assistant',
      max_tokens: 1000,
      temperature: 0.7
    }
  })

  return typeof response?.content === 'string' ? response.content : ''
}

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const setFeedback = (index: number, value: Exclude<FeedbackValue, null>) => {
  const target = messages.value[index]
  if (!target || target.role !== 'assistant') return

  const nextValue: FeedbackValue = target.feedback === value ? null : value
  messages.value[index] = { ...target, feedback: nextValue }
}

const handleFeedbackChange = (index: number, feedbackType: string) => {
  const target = messages.value[index]
  if (!target || target.role !== 'assistant') return

  // Update local state to reflect the feedback
  messages.value[index] = { ...target, feedback: feedbackType === 'removed' ? null : feedbackType as FeedbackValue }
}

const copyAssistantMessage = async (index: number) => {
  if (typeof window === 'undefined') return

  const target = messages.value[index]
  if (!target || target.role !== 'assistant') return

  const text = target.content

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
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
  } catch (error) {
    console.error('Fallback copy failed:', error)
  }
}

const retryAssistantMessage = async (index: number) => {
  if (isLoading.value) return

  const target = messages.value[index]
  if (!target || target.role !== 'assistant') return

  let prompt: string | null = null
  for (let i = index - 1; i >= 0; i--) {
    const candidate = messages.value[i]
    if (candidate.role === 'user') {
      prompt = candidate.content
      break
    }
  }

  if (!prompt) {
    console.warn('Retry aborted: Kein vorheriger Nutzereingabe gefunden.')
    return
  }

  isLoading.value = true

  try {
    const regeneratedContent = await requestAssistantResponse(prompt)
    messages.value[index] = {
      role: 'assistant',
      content: regeneratedContent || assistantEmptyFallback,
      timestamp: new Date(),
      feedback: null,
      id: generateMessageId()
    }
  } catch (error) {
    console.error('Error regenerating assistant response:', error)
    messages.value[index] = {
      role: 'assistant',
      content: assistantErrorMessage,
      timestamp: new Date(),
      feedback: null,
      id: generateMessageId()
    }
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return

  const userMessage = currentMessage.value.trim()
  currentMessage.value = ''

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
    feedback: null,
    id: generateMessageId()
  })

  scrollToBottom()
  isLoading.value = true

  try {
    const assistantContent = await requestAssistantResponse(userMessage)
    messages.value.push({
      role: 'assistant',
      content: assistantContent || assistantEmptyFallback,
      timestamp: new Date(),
      feedback: null,
      id: generateMessageId()
    })
  } catch (error) {
    console.error('Error calling AI API:', error)
    messages.value.push({
      role: 'assistant',
      content: assistantErrorMessage,
      timestamp: new Date(),
      feedback: null,
      id: generateMessageId()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const clearChat = () => {
  messages.value = []
}
</script>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #5b7ce6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #4a6cd4;
}
</style>

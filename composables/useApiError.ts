import { ref } from 'vue'

export function useApiError() {
  const lastError = ref<string | null>(null)

  function normalize(error: unknown): string {
    if (error && typeof error === 'object') {
      const errObj = error as any
      const messageFromFetch = errObj?.data?.error?.message || errObj?.data?.message
      if (messageFromFetch) return messageFromFetch
      const messageFromResponse = errObj?.response?.data?.error?.message || errObj?.response?.data?.message
      if (messageFromResponse) return messageFromResponse
      const msg = errObj?.message
      if (typeof msg === 'string') return msg
    }
    if (typeof error === 'string') return error
    return 'Unbekannter Fehler'
  }

  function capture(error: unknown) {
    lastError.value = normalize(error)
  }

  function reset() {
    lastError.value = null
  }

  return { lastError, capture, reset }
}

import { ref } from 'vue'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const cacheStore: Map<string, CacheEntry<any>> = new Map()

export function useApiCache<T>(key: string, loader: () => Promise<T>, options: { ttl?: number } = {}) {
  const ttl = options.ttl ?? 1000 * 60 * 2
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh(force = false) {
    const cached = cacheStore.get(key)
    const isExpired = !cached || Date.now() - cached.timestamp > cached.ttl

    if (cached) {
      data.value = cached.data
      if (!force && !isExpired) {
        return cached.data
      }
    }

    loading.value = true
    error.value = null
    try {
      const result = await loader()
      data.value = result
      cacheStore.set(key, { data: result, timestamp: Date.now(), ttl })
      return result
    } catch (err: any) {
      error.value = err?.message || 'Fehler beim Laden'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, refresh }
}

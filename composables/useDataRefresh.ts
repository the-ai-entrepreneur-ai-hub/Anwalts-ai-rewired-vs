import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useDataRefresh(
  refreshFn: () => Promise<void>,
  options: { interval?: number; autoStart?: boolean } = {}
) {
  const intervalMs = options.interval ?? 1000 * 60 * 5
  const autoStart = options.autoStart ?? true
  const isRefreshing = ref(false)
  const lastRefreshed = ref<Date | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null

  async function trigger(force = false) {
    if (isRefreshing.value) return
    isRefreshing.value = true
    try {
      await refreshFn()
      lastRefreshed.value = new Date()
    } finally {
      isRefreshing.value = false
    }
  }

  function start() {
    if (timer) return
    timer = setInterval(() => {
      trigger()
    }, intervalMs)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    if (autoStart) start()
  })

  onBeforeUnmount(() => {
    stop()
  })

  return { trigger, start, stop, isRefreshing, lastRefreshed }
}

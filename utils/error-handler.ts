export function toUserMessage(e: any, fallback = 'An error occurred') {
  return e?.data?.detail?.message || e?.data?.message || e?.message || fallback
}

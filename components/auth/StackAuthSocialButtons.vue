<template>
  <div class="space-y-3">
    <button
      type="button"
      class="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
      @click="$emit('google')"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 11.8v4.8h6.7a6.8 6.8 0 0 1-2.9 4.5l4.7 3.6C23.3 21.9 24 19.2 24 16.8A12 12 0 0 0 12 4v7.8z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.8-1 7.7-2.7l-4.7-3.6c-.8.5-1.8.8-3 .8-2.3 0-4.2-1.5-4.9-3.5l-4.8 3.7C4 21.7 7.7 24 12 24z" />
        <path fill="#4A90E2" d="M7.1 11.9a5 5 0 0 1 0-3.2L2.3 5A12 12 0 0 0 0 12a12 12 0 0 0 2.3 7l4.8-3.6a5 5 0 0 1 0-3.5z" />
        <path fill="#FBBC05" d="M12 4.8a6.5 6.5 0 0 1 4.6 1.8l3.4-3.4A11.3 11.3 0 0 0 12 0C7.7 0 4 2.3 2.3 5.9l4.9 3.8C7.8 7.3 9.7 5 12 5z" />
      </svg>
      <span>Mit Google {{ ctaLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ mode?: 'login' | 'register' }>()

const ctaLabel = computed(() => (props.mode === 'register' ? 'registrieren' : 'anmelden'))
</script>

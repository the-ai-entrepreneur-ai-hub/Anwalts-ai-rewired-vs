<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div class="space-y-2">
      <label for="auth-email" class="text-sm font-medium text-white/80">E-Mail-Adresse *</label>
      <input
        id="auth-email"
        v-model.trim="form.email"
        type="email"
        autocomplete="email"
        class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
        placeholder="kanzlei@example.de"
        required
      >
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm text-white/80">
        <label for="auth-password" class="font-medium">Passwort *</label>
        <button type="button" class="text-xs text-blue-300 hover:text-blue-200" @click="togglePassword">
          {{ showPassword ? 'Verbergen' : 'Anzeigen' }}
        </button>
      </div>
      <input
        id="auth-password"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
        placeholder="Mindestens 8 Zeichen"
        required
      >
    </div>

    <label class="flex items-center gap-2 text-sm text-white/70">
      <input v-model="form.remember" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-transparent">
      <span>Angemeldet bleiben</span>
    </label>

    <button
      type="submit"
      class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-400/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="loading"
    >
      <svg v-if="loading" class="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3.5-3.5A12 12 0 0 0 4 12z" />
      </svg>
      <span>{{ loading ? 'Wird geprüft…' : 'Jetzt anmelden' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const emit = defineEmits<{
  submit: [payload: { email: string; password: string; remember: boolean }]
}>()

const props = defineProps<{ loading?: boolean }>()

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

function onSubmit() {
  emit('submit', {
    email: form.email.trim(),
    password: form.password,
    remember: form.remember,
  })
}

const loading = computed(() => props.loading ?? false)
</script>

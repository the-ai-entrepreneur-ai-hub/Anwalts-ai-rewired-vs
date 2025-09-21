<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="signup-first-name" class="text-sm font-medium text-white/80">Vorname *</label>
        <input
          id="signup-first-name"
          v-model.trim="form.firstName"
          type="text"
          autocomplete="given-name"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
          placeholder="Max"
          required
        >
      </div>
      <div class="space-y-2">
        <label for="signup-last-name" class="text-sm font-medium text-white/80">Nachname *</label>
        <input
          id="signup-last-name"
          v-model.trim="form.lastName"
          type="text"
          autocomplete="family-name"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
          placeholder="Müller"
          required
        >
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="signup-title" class="text-sm font-medium text-white/80">Titel / Position *</label>
        <input
          id="signup-title"
          v-model.trim="form.title"
          type="text"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
          placeholder="Partner, RA"
          required
        >
      </div>
      <div class="space-y-2">
        <label for="signup-firm" class="text-sm font-medium text-white/80">Kanzleiname *</label>
        <input
          id="signup-firm"
          v-model.trim="form.firmName"
          type="text"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
          placeholder="Müller & Partner"
          required
        >
      </div>
    </div>

    <div class="space-y-2">
      <label for="signup-email" class="text-sm font-medium text-white/80">Geschäftliche E-Mail *</label>
      <input
        id="signup-email"
        v-model.trim="form.email"
        type="email"
        autocomplete="email"
        class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
        placeholder="kanzlei@example.de"
        required
      >
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="signup-password" class="text-sm font-medium text-white/80">Passwort *</label>
        <input
          id="signup-password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          minlength="8"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
          placeholder="Mindestens 8 Zeichen"
          required
        >
      </div>
      <div class="space-y-2">
        <label for="signup-confirm" class="text-sm font-medium text-white/80">Passwort bestätigen *</label>
        <input
          id="signup-confirm"
          v-model="form.confirmPassword"
          type="password"
          autocomplete="new-password"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none"
          placeholder="Passwort erneut eingeben"
          required
        >
      </div>
    </div>

    <p v-if="errors.password" class="text-xs text-red-200">{{ errors.password }}</p>

    <label class="flex items-start gap-2 text-sm text-white/70">
      <input v-model="form.terms" type="checkbox" class="mt-1 h-4 w-4 rounded border-white/20 bg-transparent">
      <span>
        Ich akzeptiere die
        <NuxtLink to="/terms" class="text-blue-300 hover:text-blue-200" target="_blank">AGB</NuxtLink>
        und die
        <NuxtLink to="/privacy" class="text-blue-300 hover:text-blue-200" target="_blank">Datenschutzerklärung</NuxtLink>.
      </span>
    </label>
    <p v-if="errors.terms" class="text-xs text-red-200">{{ errors.terms }}</p>

    <button
      type="submit"
      class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-400/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="loading"
    >
      <svg v-if="loading" class="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3.5-3.5A12 12 0 0 0 4 12z" />
      </svg>
      <span>{{ loading ? 'Wird erstellt…' : 'Kostenlos registrieren' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

const emit = defineEmits<{
  submit: [payload: {
    email: string
    password: string
    first_name: string
    last_name: string
    title: string
    firm_name: string
    terms_accepted: boolean
  }]
}>()

const props = defineProps<{ loading?: boolean }>()

const form = reactive({
  firstName: '',
  lastName: '',
  title: '',
  firmName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const errors = reactive({
  password: '',
  terms: '',
})

function validate() {
  errors.password = ''
  errors.terms = ''
  let valid = true
  if (form.password !== form.confirmPassword) {
    errors.password = 'Die Passwörter stimmen nicht überein.'
    valid = false
  }
  if (form.password.length < 8) {
    errors.password = 'Das Passwort muss mindestens 8 Zeichen enthalten.'
    valid = false
  }
  if (!form.terms) {
    errors.terms = 'Bitte bestätigen Sie die Bedingungen.'
    valid = false
  }
  return valid
}

function onSubmit() {
  if (!validate()) return
  emit('submit', {
    email: form.email.trim(),
    password: form.password,
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    title: form.title.trim(),
    firm_name: form.firmName.trim(),
    terms_accepted: form.terms,
  })
}

const loading = computed(() => props.loading ?? false)
</script>

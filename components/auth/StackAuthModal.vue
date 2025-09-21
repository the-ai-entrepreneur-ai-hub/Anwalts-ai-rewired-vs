<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
      tabindex="-1"
      @keydown.esc="close"
      @click.self="close"
    >
      <div class="w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        <header class="flex items-center justify-between border-b border-white/10 px-8 py-6">
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-blue-300">ANWALTS.AI</p>
            <h2 class="mt-1 text-2xl font-semibold">
              {{ view === 'login' ? 'Willkommen zurück' : 'Konto erstellen' }}
            </h2>
          </div>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            @click="close"
            aria-label="Modal schließen"
          >
            <span class="text-lg leading-none">×</span>
          </button>
        </header>

        <div class="border-b border-white/10 bg-slate-900/80 px-8 pt-5">
          <nav class="flex gap-3 text-sm font-medium">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              :class="[
                'rounded-full px-4 py-2 transition focus:outline-none',
                view === tab.value
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-white/60 hover:text-white'
              ]"
              @click="switchView(tab.value)"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <section class="space-y-6 px-8 py-7">
          <AuthSocialButtons :mode="view" @google="loginWithGoogle" />

          <div class="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/40">
            <span class="h-px w-full bg-white/10" aria-hidden="true"></span>
            <span>E-Mail Zugang</span>
            <span class="h-px w-full bg-white/10" aria-hidden="true"></span>
          </div>

          <p v-if="error" class="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {{ error }}
          </p>

          <component
            :is="currentForm"
            :loading="isSubmitting"
            @submit="handleSubmit"
          />
        </section>

        <footer class="border-t border-white/10 bg-slate-900/70 px-8 py-5 text-sm text-white/70">
          <template v-if="view === 'login'">
            Noch kein Konto?
            <button type="button" class="ml-1 font-semibold text-blue-300 hover:text-blue-200" @click="switchView('register')">
              Registrieren
            </button>
          </template>
          <template v-else>
            Bereits registriert?
            <button type="button" class="ml-1 font-semibold text-blue-300 hover:text-blue-200" @click="switchView('login')">
              Jetzt anmelden
            </button>
          </template>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import AuthSocialButtons from '~/components/auth/StackAuthSocialButtons.vue'
import AuthLoginForm from '~/components/auth/StackAuthLoginForm.vue'
import AuthRegisterForm from '~/components/auth/StackAuthRegisterForm.vue'

type AuthView = 'login' | 'register'

const authStore = useAuthStore()
const { showAuthModal: isOpen, authModalView: view, isSubmitting, authError: error } = storeToRefs(authStore)

const tabs = [
  { label: 'Anmelden', value: 'login' as AuthView },
  { label: 'Registrieren', value: 'register' as AuthView },
]

const currentForm = computed(() => (view.value === 'login' ? AuthLoginForm : AuthRegisterForm))

function switchView(next: AuthView) {
  authStore.setView(next)
}

function close() {
  authStore.close()
}

async function handleSubmit(payload: Record<string, any>) {
  try {
    if (view.value === 'login') {
      await authStore.login(payload)
    } else {
      await authStore.register(payload)
    }
  } catch (error) {
    console.warn('Auth submission failed', error)
  }
}

function loginWithGoogle() {
  authStore.loginWithGoogle()
}
</script>

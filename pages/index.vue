<template>
  <div class="min-h-screen">
    <FramerPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import FramerPage from "~/components/FramerPage.vue"
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

definePageMeta({
  layout: false
})

// Function to open auth modal - exposed globally for iframe communication
const openAuthModal = () => {
  authStore.open('login')
}

// Sanitize unwanted message params like ?message=free_limit_reached
if (process.client) {
  const url = new URL(window.location.href)
  if (url.searchParams.has("message")) {
    url.searchParams.delete("message")
    window.history.replaceState({}, document.title, url.pathname + url.search)
  }
}

// Setup global auth modal opener and message listener
onMounted(() => {
  // Expose openAuthModal globally for iframe access
  window.openAuthModal = openAuthModal
  window.openRegisterModal = () => authStore.open('register')
  
  // Listen for messages from iframe
  window.addEventListener("message", (event) => {
    if (event?.data?.type === "openSignInModal") {
      openAuthModal()
    }
  })
  
  // Also intercept any direct navigation attempts to framer links
  document.addEventListener("click", (e) => {
    const target = e.target
    if (target && target.tagName === "A") {
      const href = target.getAttribute("href") || ""
      if (href.includes("framer.") || href.includes("login") || href.includes("registrieren")) {
        e.preventDefault()
        e.stopPropagation()
        openAuthModal()
      }
    }
  }, true)
})
</script>

<style scoped>
/* minimal wrapper only */
</style>

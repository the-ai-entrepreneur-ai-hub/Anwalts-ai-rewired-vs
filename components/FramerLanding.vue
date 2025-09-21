<template>
  <div class="framer-landing-wrapper">
    <!-- Always show iframe instead of any fallback content -->
    <iframe
      src="/page.html"
      style="width: 100%; height: 100vh; border: none;"
    />
  </div>
</template>

<script setup>
// Simple iframe wrapper - no complex logic needed
</script>

<style scoped>
.framer-landing-wrapper {
  width: 100%;
  height: 100vh;
}
</style>
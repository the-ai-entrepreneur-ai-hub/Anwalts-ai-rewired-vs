<template>
  <div>
    <NuxtPage />
    <StackAuthModal />
  </div>
</template>

<script setup>
import StackAuthModal from '~/components/auth/StackAuthModal.vue'
</script>
<style>
/* global tour removal */
.tour-overlay,.tour-step,#tourOverlay,#tourStep,#btnHelp,#btnStartTour{display:none!important}
</style>

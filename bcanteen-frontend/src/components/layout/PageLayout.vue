<template>
  <div class="min-h-screen bg-bg max-w-md mx-auto relative">
    <slot />
    <BottomNav v-if="showNav" />
    <!-- bottom padding so content clears nav -->
    <div v-if="showNav" class="h-20" />
  </div>
</template>

<script setup>
import BottomNav from './BottomNav.vue'

defineProps({
  showNav: { type: Boolean, default: true }
})
</script>

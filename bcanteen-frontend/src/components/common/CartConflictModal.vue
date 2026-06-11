<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/40">
      <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl animate-slide-up">
        <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7M17 13l1.4 7M9 20a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </div>
        <h3 class="font-bold text-gray-900 text-center text-base">Start a new order?</h3>
        <p class="text-gray-500 text-sm text-center mt-2 leading-relaxed">
          Your cart has items from another tenant. Clear cart and start a new order?
        </p>
        <div class="flex gap-3 mt-6">
          <button
            class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            @click="$emit('cancel')"
          >Cancel</button>
          <button
            class="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-600 transition-colors"
            @click="$emit('confirm')"
          >Clear & Continue</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({ show: Boolean })
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.25s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>

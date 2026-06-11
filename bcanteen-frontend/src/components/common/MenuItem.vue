<template>
  <div class="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm">
    <!-- Image -->
    <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        :src="menu.image_url"
        :alt="menu.name"
        class="w-full h-full object-cover"
        @error="onImgError"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-gray-900 text-sm leading-tight">{{ menu.name }}</h4>
      <p class="text-gray-400 text-xs mt-0.5 line-clamp-2">{{ menu.description }}</p>
      <p class="text-primary font-bold text-sm mt-1.5">{{ formatCurrency(menu.price) }}</p>
    </div>

    <!-- Add button -->
    <button
      class="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-primary-600 transition-colors active:scale-95"
      :class="{ 'opacity-50 cursor-not-allowed': !menu.is_available }"
      :disabled="!menu.is_available"
      @click.prevent="$emit('add', menu)"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({ menu: { type: Object, required: true } })
defineEmits(['add'])

function onImgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
}
</script>

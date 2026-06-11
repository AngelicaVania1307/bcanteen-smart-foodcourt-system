<template>
  <router-link :to="`/tenants/${tenant.id}`" class="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <!-- Logo/Image -->
    <div class="w-16 h-16 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0">
      <img
        :src="tenant.image_url"
        :alt="tenant.name"
        class="w-full h-full object-cover"
        @error="onImgError"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 text-sm truncate">{{ tenant.name }}</h3>
        <span
          class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
          :class="tenant.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
        >{{ tenant.is_open ? 'OPEN' : 'CLOSED' }}</span>
      </div>
      <p class="text-gray-500 text-xs mt-0.5 truncate">{{ tenant.cuisine_type }}</p>
      <div class="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
        <span class="text-yellow-400">★</span>
        <span>{{ tenant.rating }}</span>
        <span>·</span>
        <span>{{ tenant.prep_time_min }}-{{ tenant.prep_time_min + 5 }} min</span>
      </div>
    </div>

    <!-- Arrow -->
    <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </router-link>
</template>

<script setup>
defineProps({ tenant: { type: Object, required: true } })

function onImgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
}
</script>

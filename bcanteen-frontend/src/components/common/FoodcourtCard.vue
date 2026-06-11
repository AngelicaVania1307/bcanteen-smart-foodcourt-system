<template>
  <router-link :to="`/foodcourts/${foodcourt.id}`" class="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <!-- Image -->
    <div class="relative h-44 bg-gray-200">
      <img
        :src="foodcourt.image_url"
        :alt="foodcourt.name"
        class="w-full h-full object-cover"
        @error="onImgError"
      />
      <!-- Rating badge -->
      <div class="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-800">
        <span class="text-yellow-400">★</span>
        {{ foodcourt.rating }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="font-bold text-gray-900 text-base leading-tight">
            {{ foodcourt.name || 'Unknown Foodcourt' }}
          </h3>
          <p class="text-gray-500 text-xs mt-0.5">{{ cuisineTypes }}</p>
        </div>
        <span class="text-xs text-gray-500 ml-2 flex-shrink-0">{{ foodcourt.distance_km }} km</span>
      </div>

      <!-- Tags -->
      <div v-if="tags.length" class="flex gap-2 mt-3 flex-wrap">
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-xs px-2.5 py-1 rounded-full font-medium"
          :class="tagClass(tag)"
        >{{ tag }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  foodcourt: { type: Object, required: true }
})

const cuisineTypes = computed(() => {
  if (Array.isArray(props.foodcourt.cuisine_types)) {
    return props.foodcourt.cuisine_types.join(' • ')
  }

  if (props.foodcourt.description) {
    return props.foodcourt.description.split(' ').slice(0, 5).join(' ') + '...'
  }

  return ''
})

const tags = computed(() => props.foodcourt.tags || [])

const tagColors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-orange-100 text-orange-700', 'bg-purple-100 text-purple-700']
function tagClass(tag) {
  const idx = tag.charCodeAt(0) % tagColors.length
  return tagColors[idx]
}

function onImgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800'
}
</script>

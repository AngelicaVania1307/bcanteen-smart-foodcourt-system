<template>
  <PageLayout>
    <!-- Search Header -->
    <div class="sticky top-0 z-40 bg-bg px-4 pt-4 pb-3">
      <div class="flex items-center gap-3">
        <button @click="$router.back()">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Search food courts or dishes..."
            class="w-full bg-white rounded-xl pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
            @input="onSearch"
          />
          <button v-if="query" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" @click="query = ''; results = []">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <svg class="w-9 h-9 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Nearby Foodcourts (no query) -->
    <div v-if="!query" class="px-4 space-y-4">
      <div>
        <div class="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm mb-4">
          <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div class="flex-1">
            <p class="text-gray-400 text-xs">Your current location</p>
            <p class="text-gray-900 text-sm font-semibold">Central Business District</p>
          </div>
          <button class="text-primary text-xs font-semibold">Change</button>
        </div>

        <!-- Map placeholder -->
        <div class="relative h-36 bg-teal-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
          <svg class="w-10 h-10 text-teal-400 opacity-50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          <button class="absolute bottom-2 right-2 bg-white text-xs text-gray-700 font-medium px-2.5 py-1 rounded-lg shadow-sm">↗ View Map</button>
        </div>

        <div class="flex items-center justify-between mb-3">
          <p class="font-bold text-gray-900">{{ allFoodcourts.length }} Foodcourts Nearby</p>
          <button class="flex items-center gap-1 text-xs text-gray-600 bg-white px-2.5 py-1.5 rounded-lg shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M3 6h18M7 12h10M10 18h4"/>
            </svg>
            Distance
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingAll" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl overflow-hidden animate-pulse">
          <div class="h-32 bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>

      <!-- Nearby cards -->
      <div v-else class="space-y-4">
        <router-link
          v-for="fc in allFoodcourts"
          :key="fc.id"
          :to="`/foodcourts/${fc.id}`"
          class="block bg-white rounded-2xl overflow-hidden shadow-sm"
        >
          <div class="relative h-36 bg-gray-200">
            <img :src="fc.image_url" :alt="fc.name" class="w-full h-full object-cover" @error="e => e.target.src='https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800'" />
            <div class="absolute top-2 left-2 bg-white/90 text-xs px-1.5 py-0.5 rounded-lg text-gray-600 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              {{ fc.distance_km }} km
            </div>
            <div class="absolute top-2 right-2 bg-success text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">★ {{ fc.rating }}</div>
          </div>
          <div class="p-3">
            <div class="flex items-start justify-between">
              <h3 class="font-bold text-gray-900 text-sm">{{ fc.name }}</h3>
              <button class="text-gray-300 hover:text-red-400 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>
            <div class="flex gap-2 flex-wrap mt-1.5">
              <span v-for="tag in getCuisineTags(fc)" :key="tag" class="text-xs text-gray-500">{{ tag }}</span>
            </div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-gray-400 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 6v6l4 2"/></svg>
                Closes at 10:00 PM
              </span>
              <button class="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg">View Stalls</button>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Search Results -->
    <div v-else class="px-4 space-y-3">
      <div class="mb-4">
        <p class="font-bold text-gray-900 text-sm">Results</p>
        <p class="text-gray-500 text-xs">{{ results.length }} foodcourt{{ results.length !== 1 ? 's' : '' }} found</p>
      </div>

      <div v-if="searching" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl flex gap-3 p-3 animate-pulse">
          <div class="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
          <div class="flex-1 space-y-2 py-1">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>

      <router-link
        v-for="fc in results"
        :key="fc.id"
        :to="`/foodcourts/${fc.id}`"
        class="flex gap-3 bg-white rounded-2xl p-3 shadow-sm items-center"
      >
        <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img :src="fc.image_url" :alt="fc.name" class="w-full h-full object-cover" @error="e => e.target.src='https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800'" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <h3 class="font-bold text-gray-900 text-sm">{{ fc.name }}</h3>
            <span class="bg-success text-white text-xs font-bold px-1.5 py-0.5 rounded-lg ml-2 flex-shrink-0">★ {{ fc.rating }}</span>
          </div>
          <p class="text-gray-500 text-xs mt-0.5">📍 {{ fc.distance_km }}km · {{ fc.location }}</p>
          <div class="flex gap-1.5 mt-1.5 flex-wrap">
            <span v-for="tag in getCuisineTags(fc)" :key="tag" class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{{ tag }}</span>
          </div>
        </div>
      </router-link>

      <div v-if="!searching && results.length === 0" class="text-center py-12 text-gray-500">
        <p class="text-lg mb-1">🔍</p>
        <p class="font-semibold text-gray-700">No results for "{{ query }}"</p>
        <p class="text-xs mt-1">Try different keywords</p>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import { foodcourtAPI } from '@/services/api'

const query = ref('')
const allFoodcourts = ref([])
const results = ref([])
const loadingAll = ref(true)
const searching = ref(false)
const inputRef = ref(null)

let debounce = null

function onSearch() {
  if (!query.value.trim()) { results.value = []; return }
  searching.value = true
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    const q = query.value.toLowerCase()
    results.value = allFoodcourts.value.filter(fc =>
      fc.name.toLowerCase().includes(q) || fc.location?.toLowerCase().includes(q)
    )
    searching.value = false
  }, 300)
}

function getCuisineTags(fc) {
  if (fc.cuisine_types) return fc.cuisine_types
  const parts = fc.description?.split(' ') || []
  return parts.slice(0, 3)
}

onMounted(async () => {
  await nextTick()
  inputRef.value?.focus()
  try {
    const res = await foodcourtAPI.getAll()
    allFoodcourts.value = res.data.data || res.data
  } finally {
    loadingAll.value = false
  }
})
</script>

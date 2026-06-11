<template>
  <PageLayout>
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-bg pt-4 px-4 pb-3">
      <div class="flex items-center justify-center mb-4">
        <img
          src="/logo.png"
          alt="BCanteen"
          class="h-14 md:h-16 w-auto object-contain"
        />
      </div>

      <!-- Search -->
      <div class="relative" @click="$router.push('/search')">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
        </svg>
        <div class="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-gray-400 shadow-sm cursor-pointer">
          Search food courts or dishes...
        </div>
      </div>
    </div>

    <div class="px-4 space-y-6 pb-4">
      <!-- Welcome text -->
      <div>
        <h2 class="text-lg font-bold text-gray-900">Hungry for something?</h2>
        <p class="text-gray-500 text-sm">Find the best food in your workplace</p>
      </div>

      <!-- Active Order Banner (mock) -->
      <div class="bg-primary rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-white/80 text-xs font-medium">ACTIVE ORDER</p>
          <p class="text-white font-bold text-sm">Prepping your Ramen...</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="bg-success text-white text-xs font-bold px-2 py-1 rounded-full">12-15 min</span>
          <span class="text-white text-xs font-medium">Track →</span>
        </div>
      </div>

      <!-- Categories -->
      <div>
        <h3 class="font-bold text-gray-900 mb-3">Categories</h3>
        <div class="flex gap-3">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="flex flex-col items-center gap-2"
            :class="activeCategory === cat.name ? '' : ''"
            @click="activeCategory = cat.name"
          >
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
              :class="activeCategory === cat.name ? 'bg-success' : 'bg-white shadow-sm'"
            >
              <span class="text-2xl">{{ cat.emoji }}</span>
            </div>
            <span class="text-xs text-gray-600 font-medium">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Featured Foodcourts -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-gray-900">Featured Foodcourts</h3>
          <button class="text-primary text-sm font-semibold" @click="$router.push('/search')">View all</button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl overflow-hidden animate-pulse">
            <div class="h-44 bg-gray-200" />
            <div class="p-4 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-8 text-gray-500 text-sm">
          Failed to load foodcourts.
          <button class="block mx-auto mt-2 text-primary font-semibold" @click="loadFoodcourts">Retry</button>
        </div>

        <!-- List -->
        <div v-else class="space-y-4">
          <FoodcourtCard v-for="fc in foodcourts" :key="fc.id" :foodcourt="fc" />
        </div>
      </div>
    </div>

    <!-- Floating Cart -->
    <button
      v-if="cartStore.totalItems > 0"
      class="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center z-50"
      @click="$router.push('/cart')"
    >
      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7.5 17h11v-2H7.82c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H17c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{{ cartStore.totalItems }}</span>
    </button>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import FoodcourtCard from '@/components/common/FoodcourtCard.vue'
import { foodcourtAPI } from '@/services/api'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const foodcourts = ref([])
const loading = ref(true)
const error = ref(false)
const activeCategory = ref('Popular')

const categories = [
  { name: 'Popular', emoji: '🔥' },
  { name: 'Nearby', emoji: '📍' },
  { name: 'New', emoji: '✨' },
  { name: 'Promo', emoji: '🏷️' }
]

async function loadFoodcourts() {
  try {
    const res = await foodcourtAPI.getAll()

    console.log('FOODCOURTS API:', res.data)

    foodcourts.value = res.data.data   // INI BENAR
  } catch (err) {
    console.error('FAILED:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
  loadFoodcourts()
})
</script>

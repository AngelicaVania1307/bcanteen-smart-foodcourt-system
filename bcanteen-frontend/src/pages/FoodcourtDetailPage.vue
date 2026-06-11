<template>
  <PageLayout>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="data">
      <!-- Hero Banner -->
      <div class="relative h-56 bg-gray-800">
        <img
          :src="data.foodcourt?.image_url"
          :alt="data.foodcourt?.name"
          class="w-full h-full object-cover"
          @error="e => e.target.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <!-- Back button -->
        <button class="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" @click="$router.back()">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Header actions -->
        <div class="absolute top-4 right-4 flex gap-2">
          <button class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" @click="$router.push('/search')">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <!-- Foodcourt Info overlay -->
        <div class="absolute bottom-4 left-4 right-4">
          <h1 class="text-white font-bold text-xl">{{ data.foodcourt?.name }}</h1>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-yellow-400 text-sm">★ {{ data.foodcourt?.rating }}</span>
            <span class="text-white/70 text-sm">({{ data.foodcourt?.distance_km }}k Reviews)</span>
          </div>
          <div class="flex items-center gap-1 mt-1">
            <svg class="w-3.5 h-3.5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span class="text-white/70 text-xs">{{ data.foodcourt?.location }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div class="flex overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="px-5 py-4 text-sm font-semibold flex-shrink-0 border-b-2 transition-colors"
            :class="activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500'"
            @click="activeTab = tab"
          >{{ tab }}</button>
        </div>
      </div>

      <!-- Tenants Tab -->
      <div v-if="activeTab === 'Tenants'" class="p-4 space-y-3">
        <!-- Cuisine filter chips -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors bg-orange-100 text-primary border border-primary"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M3 6h18M7 12h10M10 18h4"/>
            </svg>
            Filters
          </button>
          <button
            v-for="cuisine in cuisineFilters"
            :key="cuisine"
            class="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors"
            :class="activeCuisine === cuisine ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
            @click="activeCuisine = activeCuisine === cuisine ? null : cuisine"
          >{{ cuisine }}</button>
        </div>

        <!-- Tenant list -->
        <TenantCard v-for="t in filteredTenants" :key="t.id" :tenant="t" />
      </div>

      <!-- Info Tab -->
      <div v-else-if="activeTab === 'Info'" class="p-4 space-y-4">
        <div>
          <h3 class="font-bold text-primary text-sm">How to find us</h3>
          <p class="text-gray-600 text-sm mt-2 leading-relaxed">{{ data.foodcourt?.description }}</p>
        </div>
        <!-- Map placeholder -->
        <div class="h-40 bg-teal-100 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
        </div>
        <!-- Peak hours banner -->
        <div class="bg-primary rounded-2xl p-5 text-center">
          <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 6v6l4 2"/>
          </svg>
          <p class="text-white font-semibold text-sm">Peak Hours</p>
          <p class="text-white/80 text-xs mt-1">Usually busy between 12:00 PM - 2:00 PM</p>
          <p class="text-white font-extrabold text-xl mt-3">Order Early</p>
          <p class="text-white/80 text-xs">Skip the queue by ordering in the app</p>
        </div>
      </div>

      <!-- Other tabs placeholder -->
      <div v-else class="p-6 text-center text-gray-400 text-sm">Coming soon</div>
    </template>

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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import TenantCard from '@/components/common/TenantCard.vue'
import { foodcourtAPI } from '@/services/api'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const cartStore = useCartStore()

const data = ref(null)
const loading = ref(true)
const activeTab = ref('Tenants')
const activeCuisine = ref(null)
const tabs = ['Tenants', 'Reviews', 'Info', 'Promos']

const cuisineFilters = computed(() => {
  if (!data.value?.tenants) return []
  const types = data.value.tenants.flatMap(t => t.cuisine_type?.split('·').map(s => s.trim()) || [])
  return [...new Set(types)].slice(0, 6)
})

const filteredTenants = computed(() => {
  if (!data.value?.tenants) return []
  if (!activeCuisine.value) return data.value.tenants
  return data.value.tenants.filter(t => t.cuisine_type?.includes(activeCuisine.value))
})

onMounted(async () => {
  try {
    const res = await foodcourtAPI.getById(route.params.id)
    data.value = res.data.data || res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

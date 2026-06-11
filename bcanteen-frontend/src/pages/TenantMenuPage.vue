<template>
  <PageLayout>
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="tenantData">
      <!-- Hero -->
      <div class="relative h-52 bg-gray-800">
        <img
          :src="tenantData.tenant?.image_url"
          :alt="tenantData.tenant?.name"
          class="w-full h-full object-cover"
          @error="e => e.target.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />

        <!-- Back -->
        <button class="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" @click="$router.back()">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Search + Avatar -->
        <div class="absolute top-4 right-4 flex gap-2">
          <button class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <!-- Tenant info -->
        <div class="absolute bottom-4 left-4 right-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="bg-success text-white text-xs font-bold px-2 py-0.5 rounded-full">
              ★ {{ tenantData.tenant?.rating }} (2.5k+)
            </span>
            <span class="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
              {{ tenantData.tenant?.prep_time_min }}-{{ tenantData.tenant?.prep_time_min + 10 }} min
            </span>
          </div>
          <p class="text-white/80 text-xs">{{ tenantData.tenant?.cuisine_type }}</p>
        </div>
      </div>

      <!-- Tenant name in white header -->
      <div class="bg-white px-4 pt-3 pb-2">
        <h1 class="font-bold text-gray-900 text-lg">{{ tenantData.tenant?.name }}</h1>
      </div>

      <!-- Category Tabs -->
      <div class="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div class="flex overflow-x-auto no-scrollbar px-4 gap-2 py-2">
          <button
            v-for="cat in allCategories"
            :key="cat"
            class="px-4 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 transition-colors"
            :class="activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>
      </div>

      <!-- Menu List grouped by category -->
      <div class="p-4 pb-32 space-y-6">
        <div v-for="cat in visibleCategories" :key="cat">
          <h2 class="text-primary font-bold text-lg mb-3">{{ cat }}</h2>
          <div class="space-y-3">
            <MenuItem
              v-for="item in menusByCategory[cat]"
              :key="item.id"
              :menu="item"
              @add="handleAddToCart(item)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Error state -->
    <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500 text-sm">
      Failed to load menu.
      <button class="mt-2 text-primary font-semibold" @click="loadData">Retry</button>
    </div>

    <!-- View Cart FAB -->
    <div v-if="cartStore.totalItems > 0 && cartStore.tenantId && Number(cartStore.tenantId) === Number(route.params.id)" class="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-50">
      <button
        class="w-full bg-success rounded-2xl py-4 flex items-center justify-between px-5 shadow-xl"
        @click="$router.push('/cart')"
      >
        <span class="bg-white/30 text-white font-bold text-sm px-2.5 py-1 rounded-lg">{{ cartStore.totalItems }}</span>
        <span class="text-white font-bold text-sm">View Cart</span>
        <div class="flex items-center gap-1 text-white font-bold text-sm">
          {{ formatCurrency(cartStore.totalPrice) }}
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7.5 17h11v-2H7.82c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H17c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </button>
    </div>

    <!-- Cart conflict modal -->
    <CartConflictModal :show="showConflict" @confirm="confirmSwitch" @cancel="showConflict = false" />
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import MenuItem from '@/components/common/MenuItem.vue'
import CartConflictModal from '@/components/common/CartConflictModal.vue'
import { tenantAPI, menuAPI } from '@/services/api'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const cartStore = useCartStore()

const tenantData = ref(null)
const menus = ref([])
const loading = ref(true)
const activeCategory = ref('All')
const showConflict = ref(false)
let pendingItem = null

const allCategories = computed(() => {
  const cats = [...new Set(menus.value.map(m => m.category).filter(Boolean))]
  return ['All', ...cats]
})

const menusByCategory = computed(() => {
  const result = {}

  menus.value.forEach(m => {
    if (!m.category) return
    if (!result[m.category]) result[m.category] = []
    result[m.category].push(m)
  })

  return result
})

const visibleCategories = computed(() => {
  const cats = Object.keys(menusByCategory.value)
  if (!cats.length) return []
  if (activeCategory.value === 'All') return cats
  return cats.filter(c => c === activeCategory.value)
})

function handleAddToCart(menu) {
  const success = cartStore.addItem(
    menu,
    Number(route.params.id),
    tenantData.value?.tenant?.name
  )

  if (!success) {
    pendingItem = menu
    showConflict.value = true
  }
}

function confirmSwitch() {
  cartStore.clearCart()
  showConflict.value = false

  if (pendingItem) {
    setTimeout(() => {
      cartStore.addItem(
        pendingItem,
        Number(route.params.id),
        tenantData.value?.tenant?.name
      )
      pendingItem = null
    }, 100)
  }
}

async function loadData() {
  loading.value = true
  try {
    const tenantId = route.params.id

    const [tenantRes, menuRes] = await Promise.all([
      tenantAPI.getById(tenantId),
      menuAPI.getAll({ tenant_id: tenantId })
    ])

    tenantData.value = tenantRes.data.data || tenantRes.data
    menus.value = menuRes.data.data || []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

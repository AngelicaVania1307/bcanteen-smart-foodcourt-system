<template>
  <PageLayout>
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-bg px-4 pt-4 pb-3">
      <div class="flex items-center gap-3">
        <button class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm" @click="$router.back()">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-bold text-gray-900 text-lg">My Cart</h1>
      </div>
    </div>

    <!-- Empty cart -->
    <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7.5 17h11v-2H7.82c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H17c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg">Your cart is empty</h3>
      <p class="text-gray-500 text-sm mt-1">Add some delicious food from a tenant</p>
      <button class="mt-6 bg-primary text-white font-semibold px-8 py-3 rounded-xl" @click="$router.push('/home')">
        Browse Foodcourts
      </button>
    </div>

    <!-- Cart Items -->
    <div v-else class="p-4 pb-40 space-y-3">
      <!-- Tenant label -->
      <div class="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-xl p-3 shadow-sm">
        <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/>
        </svg>
        <span class="font-semibold text-gray-900">{{ cartStore.tenantName }}</span>
      </div>

      <!-- Items -->
      <div v-for="item in cartStore.items" :key="item.menuId" class="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
        <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" @error="e => e.target.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</p>
          <p class="text-primary font-bold text-sm mt-0.5">{{ formatCurrency(item.price) }}</p>
          <div class="flex items-center gap-3 mt-2">
            <button
              class="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              @click="cartStore.updateQuantity(item.menuId, item.quantity - 1)"
            >−</button>
            <span class="font-bold text-gray-900 text-sm w-4 text-center">{{ item.quantity }}</span>
            <button
              class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold hover:bg-primary-600 transition-colors"
              @click="cartStore.updateQuantity(item.menuId, item.quantity + 1)"
            >+</button>
          </div>
        </div>
        <div class="flex flex-col items-end justify-between">
          <button class="text-gray-300 hover:text-danger transition-colors" @click="cartStore.removeItem(item.menuId)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <p class="font-bold text-gray-900 text-sm">{{ formatCurrency(item.price * item.quantity) }}</p>
        </div>
      </div>

      <!-- Total summary -->
      <div class="bg-white rounded-2xl p-4 shadow-sm space-y-2 mt-4">
        <div class="flex justify-between text-sm text-gray-500">
          <span>Subtotal ({{ cartStore.totalItems }} items)</span>
          <span>{{ formatCurrency(cartStore.totalPrice) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span>Tax (10%)</span>
          <span>{{ formatCurrency(Math.round(cartStore.totalPrice * 0.1)) }}</span>
        </div>
        <div class="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span class="text-primary">{{ formatCurrency(cartStore.totalPrice + Math.round(cartStore.totalPrice * 0.1)) }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom checkout button -->
    <div v-if="cartStore.items.length > 0" class="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-50">
      <button
        class="w-full bg-primary text-white font-bold py-4 rounded-2xl text-base shadow-xl hover:bg-primary-600 transition-colors"
        @click="$router.push('/checkout')"
      >
        Proceed to Checkout · {{ formatCurrency(cartStore.totalPrice + Math.round(cartStore.totalPrice * 0.1)) }}
      </button>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/layout/PageLayout.vue'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/format'

const cartStore = useCartStore()
</script>

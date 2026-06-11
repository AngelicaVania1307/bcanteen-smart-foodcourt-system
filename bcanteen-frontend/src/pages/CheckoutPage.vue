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
        <h1 class="font-bold text-primary text-lg">Checkout</h1>
        <div class="ml-auto flex items-center gap-2">
          <button class="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-sm">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 pb-40 space-y-4">
      <!-- Tenant Info -->
      <div>
        <div class="flex items-center gap-2 mb-0.5">
          <span class="text-lg">🍽️</span>
          <span class="font-bold text-gray-900">{{ cartStore.tenantName }}</span>
        </div>
        <p class="text-gray-500 text-xs ml-7">Food Court · Jakarta Selatan</p>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <h3 class="font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div v-for="item in cartStore.items" :key="item.menuId" class="flex gap-3 mb-4 last:mb-0">
          <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" @error="e => e.target.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <p class="font-medium text-gray-900 text-sm leading-tight pr-2 flex-1 truncate">{{ item.quantity }}x {{ item.name }}</p>
              <p class="font-semibold text-gray-900 text-sm flex-shrink-0">{{ formatCurrency(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mt-4 border-t border-gray-100 pt-4">
          <label class="text-sm font-semibold text-gray-700 block mb-2">Special Notes</label>
          <textarea
            v-model="notes"
            placeholder="e.g., no onions, extra spicy..."
            class="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            rows="3"
          />
        </div>

        <!-- Price Breakdown -->
        <div class="mt-4 border-t border-gray-100 pt-4 space-y-2">
          <div class="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{{ formatCurrency(cartStore.totalPrice) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-500">
            <span>Tax (10%)</span>
            <span>{{ formatCurrency(tax) }}</span>
          </div>
          <div class="flex justify-between font-bold text-gray-900 text-base pt-1">
            <span>Total</span>
            <span class="text-primary">{{ formatCurrency(grandTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <h3 class="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div class="space-y-2">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors"
            :class="selectedPayment === method.id ? 'border-primary bg-orange-50' : 'border-gray-200'"
          >
            <span class="text-2xl">{{ method.icon }}</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 text-sm">{{ method.name }}</p>
              <p class="text-gray-500 text-xs">{{ method.desc }}</p>
            </div>
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="selectedPayment === method.id ? 'border-primary' : 'border-gray-300'"
            >
              <div v-if="selectedPayment === method.id" class="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <input type="radio" class="hidden" :value="method.id" v-model="selectedPayment" />
          </label>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl p-4">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm text-gray-500">Total Payment</span>
          <span class="font-bold text-primary text-lg">{{ formatCurrency(grandTotal) }}</span>
        </div>
        <button
          class="w-full bg-primary text-white font-bold py-4 rounded-xl text-base hover:bg-primary-600 transition-colors disabled:opacity-60"
          :disabled="submitting"
          @click="placeOrder"
        >
          <span v-if="!submitting">Place Order</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        </button>
      </div>
    </div>

    <!-- Error toast -->
    <div v-if="errorMsg" class="fixed top-4 left-0 right-0 max-w-md mx-auto px-4 z-[100]">
      <div class="bg-danger text-white rounded-xl px-4 py-3 text-sm font-medium shadow-lg">{{ errorMsg }}</div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { useCartStore } from '@/stores/cartStore'
import { orderAPI } from '@/services/api'
import { formatCurrency } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()

const notes = ref('')
const selectedPayment = ref('qris')
const submitting = ref(false)
const errorMsg = ref('')

const tax = computed(() => Math.round(cartStore.totalPrice * 0.1))
const grandTotal = computed(() => cartStore.totalPrice + tax.value)

const paymentMethods = [
  { id: 'qris', name: 'QRIS', desc: 'Instant payment via any app', icon: '🔲' },
  { id: 'mbanking', name: 'M-Banking', desc: 'Virtual Account Transfer', icon: '🏦' },
  { id: 'cash', name: 'Cash', desc: 'Pay at the cashier', icon: '💵' }
]

async function placeOrder() {
  if (cartStore.items.length === 0 || !cartStore.tenantId) {
    errorMsg.value = 'Cart is empty or invalid tenant'
    return
  }
  submitting.value = true
  errorMsg.value = ''
  try {
    console.log('tenantId raw:', cartStore.tenantId)
    console.log('tenantId parsed:', Number(cartStore.tenantId))

    console.log({
      tenant_id: Number(cartStore.tenantId),
      rawTenant: cartStore.tenantId,
      items: cartStore.items,
      total_price: grandTotal.value
    })

    const payload = {
      tenant_id: Number(cartStore.tenantId),
      notes: `${notes.value} | payment: ${selectedPayment.value}`,
      total_price: Number(grandTotal.value),
      items: cartStore.items.map(i => ({
        menu_id: i.menuId,
        quantity: i.quantity
      }))
    }
    const res = await orderAPI.create(payload)
    console.log('ORDER RESPONSE:', res.data)
    const code = res.data.data?.order_code || res.data.data?.orderCode
    cartStore.clearCart()
    router.replace(`/order-success/${code}`)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || e.message || 'Failed to place order. Please try again.'
    setTimeout(() => { errorMsg.value = '' }, 4000)
  } finally {
    submitting.value = false
  }
}
</script>

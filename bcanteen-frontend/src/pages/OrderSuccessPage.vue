<template>
  <PageLayout :show-nav="false">
    <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <!-- Success animation -->
      <div class="relative mb-8">
        <div class="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center">
          <div class="w-20 h-20 bg-success rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <!-- Decorative dots -->
        <div class="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60" />
        <div class="absolute -bottom-1 -left-3 w-3 h-3 bg-yellow-400 rounded-full opacity-60" />
      </div>

      <h1 class="text-2xl font-extrabold text-gray-900 text-center">Order Placed!</h1>
      <p class="text-gray-500 text-sm text-center mt-2">Show this code at the counter to collect your food</p>

      <!-- Order Code -->
      <div class="mt-8 w-full bg-white rounded-3xl p-6 shadow-sm text-center">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Your Order Code</p>
        <div class="bg-orange-50 border-2 border-dashed border-primary rounded-2xl py-4 px-6">
          <p class="text-4xl font-extrabold text-primary tracking-widest">{{ route.params.code }}</p>
        </div>
        <p class="text-gray-500 text-xs mt-3">Show this code to the tenant staff</p>
      </div>

      <!-- Order details -->
      <div v-if="order" class="mt-4 w-full bg-white rounded-2xl p-4 shadow-sm space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Tenant</span>
          <span class="font-semibold text-gray-900">{{ order.tenant_name || 'Tenant' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Total Items</span>
          <span class="font-semibold text-gray-900">{{ order.item_count || '—' }} items</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Total Price</span>
          <span class="font-bold text-primary">{{ order.total_price ? formatCurrency(order.total_price) : '—' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Status</span>
          <span class="font-semibold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full text-xs">{{ order.status || 'Pending' }}</span>
        </div>
      </div>

      <!-- Info card -->
      <div class="mt-4 w-full bg-blue-50 rounded-2xl p-4 flex gap-3">
        <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/>
        </svg>
        <p class="text-blue-700 text-xs leading-relaxed">
          Your order is being prepared. Head to the tenant counter and show your order code when your food is ready.
        </p>
      </div>

      <!-- Actions -->
      <div class="mt-8 w-full space-y-3">
        <button
          class="w-full bg-primary text-white font-bold py-4 rounded-2xl text-sm hover:bg-primary-600 transition-colors"
          @click="$router.push('/home')"
        >Back to Home</button>
        <button
          class="w-full border border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
          @click="orderMore"
        >Order More Food</button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { orderAPI } from '@/services/api'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const order = ref(null)

onMounted(async () => {
  try {
    const res = await orderAPI.getByCode(route.params.code)
    order.value = res.data.data || res.data
  }catch (err) {
    console.error(err)
  }
})

function orderMore() { router.push('/home') }
</script>

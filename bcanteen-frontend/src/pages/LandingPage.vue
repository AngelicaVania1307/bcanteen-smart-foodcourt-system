<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
    <!-- Logo -->
    <div class="mb-12">
      <img
        src="/logo.png"
        alt="BCanteen"
        class="h-24 md:h-28 w-auto mx-auto object-contain"
      />
    </div>

    <!-- Hero Text -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">
        Welcome to the<br />future of dining
      </h1>
      <p class="text-gray-500 mt-3 text-sm leading-relaxed">
        Choose your journey and experience seamless food court management and ordering.
      </p>
    </div>

    <!-- Order Card -->
    <div class="w-full border border-gray-200 rounded-2xl p-6 mb-4 hover:shadow-md transition-shadow cursor-pointer" @click="goOrder">
      <div class="w-11 h-11 bg-success rounded-2xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
        </svg>
      </div>
      <h2 class="font-bold text-gray-900 text-lg">I want to order</h2>
      <p class="text-gray-500 text-sm mt-1">Browse local menus and get real-time tracking of your favorite meals.</p>
      <button
        class="mt-5 w-full bg-primary text-white font-semibold py-3.5 rounded-xl text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        @click.stop="goOrder"
      >
        Start Ordering
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>

    <!-- Management Card -->
    <div class="w-full border border-gray-200 rounded-2xl p-6">
      <div class="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.12 15.88 0 13.3 0c-1.49 0-2.65.6-3.58 1.63L8 3.5 6.28 1.63C5.35.6 4.19 0 2.7 0 1.12 0-1 2.12-1 4.7c0 .44.1.86.18 1.3H-1c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7.7-4.5c.88 0 1.7.75 1.7 2.2 0 .44-.09.88-.3 1.3H12V3.17c.37-.45.87-.67 1.3-.67zM6.3 3.7c0-1.45.82-2.2 1.7-2.2.43 0 .93.22 1.3.67V5H7.6c-.21-.42-.3-.86-.3-1.3zM20 20H4v-2h16v2zm0-6H4V8h6.27c.18.36.41.7.73.99L12 10l1-.01c.32-.29.55-.63.73-.99H20v6z"/>
        </svg>
      </div>
      <h2 class="font-bold text-gray-900 text-lg">I'm part of management</h2>
      <p class="text-gray-500 text-sm mt-1">Access tenant dashboards, manage inventory, and monitor kitchen performance in real-time.</p>
      <button class="mt-5 w-full border-2 border-primary text-primary font-semibold py-3.5 rounded-xl text-sm hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
        Management Tenant Login
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goOrder() { router.push('/home') }
</script>

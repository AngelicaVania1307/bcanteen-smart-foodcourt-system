<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-bottom max-w-md mx-auto">
    <div class="flex items-center justify-around h-16 px-2">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors"
        :class="isActive(item) ? 'text-primary' : 'text-gray-400'"
      >
        <div
          class="flex items-center justify-center w-10 h-7 rounded-full transition-colors"
          :class="isActive(item) ? 'bg-primary text-white' : ''"
        >
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { defineComponent, h } from 'vue'

const route = useRoute()

// Inline SVG icon components
const HomeIcon = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', class: 'w-5 h-5' }, [h('path', { d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' })]) })
const MenuIcon = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'w-5 h-5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 6h18M3 12h18M3 18h18' })]) })
const OrdersIcon = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'w-5 h-5' }, [h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }), h('path', { 'stroke-linecap': 'round', d: 'M8 7h8M8 11h8M8 15h5' })]) })
const TrackIcon = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'w-5 h-5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 6h4l3 6v3H2V6h4' })]) })


const navItems = [
  { name: 'home', label: 'Home', to: '/home', icon: HomeIcon },
  { name: 'menu', label: 'Menu', to: '/home', icon: MenuIcon },
  { name: 'orders', label: 'Orders', to: '/cart', icon: OrdersIcon },
  { name: 'track', label: 'Track', to: '/home', icon: TrackIcon },
]

function isActive(item) {
  if (item.name === 'home') return route.path === '/home'
  if (item.name === 'orders') return route.path === '/cart'
  if (item.name === 'menu') return route.path.startsWith('/tenants')
  return false
}
</script>

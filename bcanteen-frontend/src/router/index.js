import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '@/pages/LandingPage.vue'
import HomePage from '@/pages/HomePage.vue'
import FoodcourtDetailPage from '@/pages/FoodcourtDetailPage.vue'
import TenantMenuPage from '@/pages/TenantMenuPage.vue'
import CartPage from '@/pages/CartPage.vue'
import CheckoutPage from '@/pages/CheckoutPage.vue'
import OrderSuccessPage from '@/pages/OrderSuccessPage.vue'
import SearchPage from '@/pages/SearchPage.vue'

const routes = [
  { path: '/', name: 'Landing', component: LandingPage },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/foodcourts/:id', name: 'FoodcourtDetail', component: FoodcourtDetailPage },
  { path: '/tenants/:id', name: 'TenantMenu', component: TenantMenuPage },
  { path: '/cart', name: 'Cart', component: CartPage },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage },
  { path: '/order-success/:code', name: 'OrderSuccess', component: OrderSuccessPage },
  { path: '/search', name: 'Search', component: SearchPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router

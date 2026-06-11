import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const tenantId = ref(null)
  const tenantName = ref('')

  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  function addItem(menu, fromTenantId, fromTenantName) {
    // If cart has items from another tenant, caller must clear first
    if (tenantId.value && tenantId.value !== fromTenantId) return false

    tenantId.value = fromTenantId
    tenantName.value = fromTenantName

    const existing = items.value.find((i) => i.menuId === menu.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({
        menuId: menu.id,
        name: menu.name,
        price: Number(menu.price),
        image_url: menu.image_url,
        quantity: 1
      })
    }
    return true
  }

  function removeItem(menuId) {
    items.value = items.value.filter((i) => i.menuId !== menuId)
    if (items.value.length === 0) clearCart()
  }

  function updateQuantity(menuId, qty) {
    if (qty <= 0) { removeItem(menuId); return }
    const item = items.value.find((i) => i.menuId === menuId)
    if (item) item.quantity = qty
  }

  function clearCart() {
    items.value = []
    tenantId.value = null
    tenantName.value = ''
  }

  return { items, tenantId, tenantName, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }
}, { persist: false })

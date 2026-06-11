import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export const foodcourtAPI = {
  getAll: () => http.get('/foodcourts'),
  getById: (id) => http.get(`/foodcourts/${id}`)
}

export const tenantAPI = {
  getById: (id) => http.get(`/tenants/${id}`)
}

export const menuAPI = {
  getAll: (params) => http.get('/menus', { params }),
  getById: (id) => http.get(`/menus/${id}`)
}

export const orderAPI = {
  create: (payload) => http.post('/orders', payload),
  getByCode: (code) => http.get(`/orders/${code}`)
}

export default http

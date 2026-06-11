# BCanteen Frontend

Vue 3 + Vite + Tailwind CSS frontend for the BCanteen digital foodcourt ordering platform.

## Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start dev server (make sure backend is running on port 5000)
npm run dev
```

App runs at: http://localhost:3000

## Project Structure

```
src/
├── assets/         # Global CSS
├── components/
│   ├── common/     # FoodcourtCard, TenantCard, MenuItem, CartConflictModal
│   └── layout/     # PageLayout, BottomNav
├── pages/          # All route pages
├── router/         # Vue Router config
├── services/       # Axios API service (foodcourtAPI, tenantAPI, orderAPI)
├── stores/         # Pinia cartStore
└── utils/          # formatCurrency
```

## Pages & Routes

| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/home` | Home (browse foodcourts) |
| `/search` | Search & Nearby |
| `/foodcourts/:id` | Foodcourt Detail + Tenant List |
| `/tenants/:id` | Tenant Menu |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/order-success/:code` | Order Success |

## Build

```bash
npm run build
```

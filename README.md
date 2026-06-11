# 🍽️ BCanteen

> A digital foodcourt ordering platform that eliminates queues and streamlines the campus dining experience.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Pages & User Flow](#-pages--user-flow)
- [Business Rules](#-business-rules)
- [Order Code Format](#-order-code-format)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## 📖 Project Description

**BCanteen** is a web-based digital foodcourt ordering platform designed for campus and workplace environments.

### Problem

Traditional foodcourt ordering creates long physical queues, especially during peak hours (lunch break). Customers waste time standing in line, and tenants struggle to manage multiple simultaneous orders efficiently.

### Solution

BCanteen allows customers to:
- **Browse** all available foodcourts and tenants from their phone or browser
- **Order** food digitally without needing to register or log in
- **Receive** a unique order code after checkout
- **Collect** food directly at the counter by showing the order code — no waiting in line

This is **not** a delivery app. Customers still collect food in person, but the queue is eliminated because the order is prepared in advance.

---

## ✨ Features

### Customer-Facing Features

| Feature | Description |
|---|---|
| 🏪 Browse Foodcourts | View all available foodcourts with ratings, distance, and cuisine types |
| 🔍 Search | Search foodcourts and dishes by name or location |
| 📍 Nearby | View foodcourts sorted by proximity |
| 🍜 Tenant Menu | Browse full menu of any tenant with categories and pricing |
| 🛒 Cart | Add/remove items, update quantities, view running total |
| 💳 Checkout | Review order, add special notes, select payment method (UI) |
| 🎫 Order Code | Auto-generated unique order code (e.g. `BCA-0001`) after successful checkout |
| ✅ Order Success | Confirmation page with order code and summary |

### Technical Features

| Feature | Description |
|---|---|
| No Login Required | Customers can order immediately without registration |
| Single-Tenant Cart | Cart enforces items from one tenant at a time with conflict resolution dialog |
| Order Persistence | All orders stored in MySQL with `Pending` status on creation |
| Responsive UI | Mobile-first design, works on all screen sizes |
| Skeleton Loading | Smooth loading states for all data-fetched pages |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [Vue.js 3](https://vuejs.org/) | ^3.3.8 | UI framework (Composition API) |
| [Vite](https://vitejs.dev/) | ^4.5.0 | Build tool & dev server |
| [Vue Router](https://router.vuejs.org/) | ^4.2.5 | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | ^2.1.7 | State management (cart store) |
| [Axios](https://axios-http.com/) | ^1.6.0 | HTTP client for API calls |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.3.5 | Utility-first CSS styling |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | >=18.x | Runtime environment |
| [Express.js](https://expressjs.com/) | ^4.x | REST API framework |
| [MySQL2](https://github.com/sidorares/node-mysql2) | ^3.x | Database driver |
| [express-validator](https://express-validator.github.io/) | ^7.x | Request validation |
| [dotenv](https://github.com/motdotla/dotenv) | ^16.x | Environment configuration |
| [cors](https://github.com/expressjs/cors) | ^2.x | Cross-origin resource sharing |

### Database

| Technology | Purpose |
|---|---|
| [MySQL 8.x](https://www.mysql.com/) | Relational database for all persistent data |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Vue 3 Frontend (Port 3000)             │   │
│   │                                                     │   │
│   │  Pages → Components → Pinia Store → Axios Service   │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │  HTTP REST API                   │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Express.js Backend (Port 5000)                  │
│                                                             │
│   Routes → Controllers → Services → Database Layer          │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │  SQL Queries
┌──────────────────────────▼──────────────────────────────────┐
│                     MySQL Database                          │
│                                                             │
│   foodcourts → tenants → menus → orders → order_items       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
foodcourts
├── id (PK)
├── name
├── description
├── image_url
├── location
├── rating
├── distance_km
└── created_at

tenants
├── id (PK)
├── foodcourt_id (FK → foodcourts.id)
├── name
├── description
├── image_url
├── cuisine_type
├── rating
├── prep_time_min
├── is_open
└── created_at

menus
├── id (PK)
├── tenant_id (FK → tenants.id)
├── name
├── description
├── price
├── category
├── image_url
├── is_available
└── created_at

orders
├── id (PK)
├── order_code (UNIQUE, e.g. BCA-0001)
├── tenant_id (FK → tenants.id)
├── total_price
├── status (Pending | Preparing | Ready | Completed)
├── notes
└── created_at

order_items
├── id (PK)
├── order_id (FK → orders.id)
├── menu_id (FK → menus.id)
├── quantity
└── subtotal
```

**Entity Relationship:**
```
foodcourts ──< tenants ──< menus
                  │
                  └──< orders ──< order_items >── menus
```

---

## 📁 Project Structure

```
bcanteen/
│
├── bcanteen-backend/                  # Express.js REST API
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── app.js                     # Entry point, Express setup
│       ├── config/
│       │   └── database.js            # MySQL connection pool
│       ├── controllers/
│       │   ├── foodcourtController.js
│       │   ├── tenantController.js
│       │   ├── menuController.js
│       │   └── orderController.js
│       ├── middleware/
│       │   ├── errorHandler.js        # Global error handler
│       │   └── validate.js            # express-validator helper
│       ├── routes/
│       │   ├── foodcourts.js
│       │   ├── tenants.js
│       │   ├── menus.js
│       │   └── orders.js
│       ├── services/
│       │   ├── foodcourtService.js
│       │   ├── tenantService.js
│       │   ├── menuService.js
│       │   └── orderService.js        # Business logic + validation
│       └── utils/
│           ├── orderCode.js           # Generates BCA-0001, BCA-0002, etc.
│           └── response.js            # Standardized API response helper
│
└── bcanteen-frontend/                 # Vue 3 SPA
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.js                    # App entry, Pinia + Router setup
        ├── App.vue                    # Root component
        ├── assets/
        │   └── main.css               # Tailwind base styles
        ├── components/
        │   ├── common/
        │   │   ├── FoodcourtCard.vue  # Foodcourt listing card
        │   │   ├── TenantCard.vue     # Tenant listing card
        │   │   ├── MenuItem.vue       # Single menu item with add button
        │   │   └── CartConflictModal.vue  # Cross-tenant cart warning
        │   └── layout/
        │       ├── PageLayout.vue     # Page wrapper with bottom nav
        │       └── BottomNav.vue      # Fixed bottom navigation bar
        ├── pages/
        │   ├── LandingPage.vue        # /  — Welcome + role selection
        │   ├── HomePage.vue           # /home — Browse foodcourts
        │   ├── SearchPage.vue         # /search — Search + nearby list
        │   ├── FoodcourtDetailPage.vue # /foodcourts/:id — Tenants list
        │   ├── TenantMenuPage.vue     # /tenants/:id — Menu + add to cart
        │   ├── CartPage.vue           # /cart — Review & edit cart
        │   ├── CheckoutPage.vue       # /checkout — Confirm & place order
        │   └── OrderSuccessPage.vue   # /order-success/:code — Order code
        ├── router/
        │   └── index.js               # All route definitions
        ├── services/
        │   └── api.js                 # Axios instance + API modules
        ├── stores/
        │   └── cartStore.js           # Pinia cart state management
        └── utils/
            └── format.js              # formatCurrency (IDR formatter)
```

---

## 🚀 Installation Guide

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) 8.x
- [Git](https://git-scm.com/)
- npm (comes with Node.js)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/bcanteen.git
cd bcanteen
```

---

### Step 2 — Set Up the Database

Open your MySQL client and run:

```sql
-- Create and initialize the database
SOURCE bcanteen-backend/src/database/schema.sql;

-- Load seed data (foodcourts, tenants, menus)
SOURCE bcanteen-backend/src/database/seed.sql;
```

Or import through a GUI tool like TablePlus, DBeaver, or phpMyAdmin.

---

### Step 3 — Set Up the Backend

```bash
cd bcanteen-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env` with your MySQL credentials (see [Environment Variables](#-environment-variables) below).

```bash
# Start the backend server
npm run dev
```

Backend will run at: `http://localhost:5000`

You should see:
```
✅ Database connected
🚀 Server running on port 5000
```

---

### Step 4 — Set Up the Frontend

Open a **new terminal tab**:

```bash
cd bcanteen-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start the frontend dev server
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

### Step 5 — Open in Browser

Navigate to `http://localhost:3000` and you should see the BCanteen landing page.

---

### Production Build

```bash
# Build frontend for production
cd bcanteen-frontend
npm run build
# Output will be in /dist folder

# Run backend in production
cd bcanteen-backend
npm start
```

---

## 🔐 Environment Variables

### Backend — `bcanteen-backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bcanteen

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend — `bcanteen-frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Overview

**Base URL:** `http://localhost:5000/api`

All responses follow this standard format:

```json
{
  "success": true,
  "data": { ... }
}
```

---

### Foodcourts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/foodcourts` | Get all foodcourts |
| `GET` | `/foodcourts/:id` | Get foodcourt detail + tenants list |

**GET /foodcourts — Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Urban Hub Foodcourt",
      "description": "...",
      "image_url": "https://...",
      "location": "Downtown District, Sector 4",
      "rating": 4.8,
      "distance_km": 2.4
    }
  ]
}
```

**GET /foodcourts/:id — Response:**
```json
{
  "success": true,
  "data": {
    "foodcourt": { "id": 1, "name": "Urban Hub Foodcourt", ... },
    "tenants": [
      {
        "id": 1,
        "name": "Wok Express",
        "cuisine_type": "Chinese · Indonesian",
        "rating": 4.8,
        "prep_time_min": 15,
        "is_open": true
      }
    ]
  }
}
```

---

### Tenants

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tenants/:id` | Get tenant detail + categories + menus |

**GET /tenants/:id — Response:**
```json
{
  "success": true,
  "data": {
    "tenant": { "id": 1, "name": "Wok Express", ... },
    "categories": ["Noodles", "Rice", "Drinks"],
    "menus": [
      {
        "id": 1,
        "name": "Signature Spicy Dan Dan",
        "description": "...",
        "price": 55000,
        "category": "Noodles",
        "image_url": "https://...",
        "is_available": true
      }
    ]
  }
}
```

---

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Create new order, returns order code |
| `GET` | `/orders/:orderCode` | Get order detail by code |

**POST /orders — Request Body:**
```json
{
  "tenantId": 1,
  "notes": "No spicy please",
  "items": [
    { "menuId": 1, "quantity": 2 },
    { "menuId": 3, "quantity": 1 }
  ]
}
```

**POST /orders — Success Response:**
```json
{
  "success": true,
  "data": {
    "orderCode": "BCA-0001",
    "totalPrice": 168000,
    "status": "Pending"
  }
}
```

**GET /orders/:orderCode — Response:**
```json
{
  "success": true,
  "data": {
    "order_code": "BCA-0001",
    "tenant_name": "Wok Express",
    "total_price": 168000,
    "status": "Pending",
    "notes": "No spicy please",
    "item_count": 3,
    "created_at": "2025-01-01T12:00:00.000Z",
    "items": [
      {
        "menu_name": "Signature Spicy Dan Dan",
        "quantity": 2,
        "subtotal": 110000
      }
    ]
  }
}
```

---

## 🗺️ Pages & User Flow

```
/ (Landing Page)
    │
    └── "Start Ordering" button
            │
            ▼
/home (Home Page)
    │  Browse featured foodcourts, search bar, categories
    │
    ├── Click foodcourt card
    │       ▼
    │   /foodcourts/:id (Foodcourt Detail)
    │       │  Tabs: Tenants / Reviews / Info
    │       │
    │       └── Click tenant card
    │               ▼
    │           /tenants/:id (Tenant Menu Page)
    │               │  Category tabs, menu items, add to cart
    │               │
    │               └── "View Cart" bar at bottom
    │
    └── /search (Search Page)
            │  Real-time search, nearby list with map
            │
            └── Click result → /foodcourts/:id

/cart (Cart Page)
    │  View items, update qty, remove items, total price
    │
    └── "Proceed to Checkout" button
            ▼
        /checkout (Checkout Page)
            │  Order summary, special notes, payment method (UI)
            │
            └── "Place Order" button → POST /api/orders
                    ▼
                /order-success/:code (Order Success Page)
                    Display order code (e.g. BCA-0042)
                    Show to tenant counter to collect food
```

---

## 📏 Business Rules

1. **No Registration Required** — Customers order immediately without creating an account.
2. **No Personal Data Collected** — No name, email, or phone number is needed.
3. **Single-Tenant Cart** — Cart can only hold items from one tenant at a time. Adding items from a different tenant shows a confirmation dialog to clear the cart.
4. **Automatic Order Code** — Every successful order generates a unique sequential code in format `BCA-XXXX`.
5. **Default Order Status** — All new orders are initialized with status `Pending`.
6. **Payment UI Only** — Payment method selection (QRIS, M-Banking, Cash) is UI-only. No real payment gateway integration.
7. **Food is Collected In Person** — This is not a delivery app. Customers collect food at the tenant counter.

---

## 🎫 Order Code Format

Orders are assigned a unique sequential code automatically by the backend:

```
BCA-0001
BCA-0002
BCA-0003
...
BCA-9999
```

**Format breakdown:**
- `BCA` — Fixed prefix (BCanteen)
- `-` — Separator
- `0001` — Zero-padded 4-digit sequential number, auto-incremented from the last order in the database

---

## 🖼️ Screenshots

| Page | Description |
|---|---|
| Landing Page | Role selection (Customer / Management) |
| Home Page | Featured foodcourts, categories, search |
| Search Page | Nearby list with distance + real-time search results |
| Foodcourt Detail | Tenant list with open/closed status, cuisine filters |
| Tenant Menu | Menu grouped by category, add to cart button |
| Cart | Item list, quantity controls, price breakdown |
| Checkout | Order summary, notes input, payment method selector |
| Order Success | Generated order code with collection instructions |

---

## 🧑‍💻 Contributing

This project is a Software Engineering course final project.

If you'd like to contribute or fork it:

```bash
# Fork the repo, then:
git clone https://github.com/your-username/bcanteen.git
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 👨‍🎓 Author

**BCanteen** — Final Project, Software Engineering Course

> Built with ❤️ using Vue 3, Express.js, and MySQL.

---

*Last updated: June 2026*

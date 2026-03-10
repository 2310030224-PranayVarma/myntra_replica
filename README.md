# Myntra Replica - Full-Stack Fashion E-Commerce Platform

## Overview

Myntra Replica is a full-stack fashion e-commerce platform inspired by Myntra. It provides a complete online shopping experience with a customer-facing storefront, a dedicated admin dashboard for inventory and order management, and a robust REST API backend backed by PostgreSQL. The platform is fully containerised and ready for local development or production deployment with Docker Compose.

## Features

- **Product Discovery** – Browse and explore a rich catalogue of fashion products
- **Shopping Cart** – Add, update, and remove items with real-time totals
- **Checkout** – Multi-step checkout flow with address and payment summary
- **Orders** – Order placement, history, and status tracking
- **Wishlist** – Save favourite items for later purchase
- **Search** – Full-text search across products, brands, and categories
- **Filters** – Filter by category, price range, size, colour, and rating
- **Recommendations** – Personalised product recommendations
- **Reviews & Ratings** – Submit and browse product reviews
- **Admin Dashboard** – Manage products, categories, orders, and users
- **JWT Authentication** – Secure login, registration, and protected routes

## Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Frontend     | Next.js 14, TypeScript, TailwindCSS, React Query, Zustand |
| Backend      | Node.js, Express, TypeScript, Prisma ORM               |
| Database     | PostgreSQL 15                                           |
| Auth         | JSON Web Tokens (JWT)                                   |
| Deployment   | Docker, Docker Compose                                  |

## Project Structure

```
myntra_replica/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── prisma/       # Prisma schema & seed
│   │   ├── src/          # Source code
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   └── Dockerfile
│   ├── storefront/       # Next.js customer storefront
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── store/
│   │   └── Dockerfile
│   └── admin/            # Next.js admin dashboard
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── hooks/
│       └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+
- **Docker** (optional, for containerised setup)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/myntra_replica.git
cd myntra_replica
```

### 2. Database Setup

Ensure PostgreSQL is running locally, then create the database:

```bash
createdb myntra_db
```

Run migrations and seed data:

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Backend Setup

```bash
cd apps/backend
cp .env.example .env          # fill in your values
npm install
npx prisma migrate dev
npm run dev                   # starts on http://localhost:4000
```

### 4. Frontend Setup

```bash
cd apps/storefront
npm install
npm run dev                   # starts on http://localhost:3000
```

### 5. Admin Setup

```bash
cd apps/admin
npm install
npm run dev                   # starts on http://localhost:3001
```

## API Reference

| Method | Path                          | Description                        | Auth Required |
|--------|-------------------------------|------------------------------------|---------------|
| POST   | /api/auth/register            | Register a new user                | No            |
| POST   | /api/auth/login               | Login and receive JWT              | No            |
| GET    | /api/products                 | List products (supports filters)   | No            |
| GET    | /api/products/:id             | Get a single product               | No            |
| POST   | /api/products                 | Create a product                   | Admin         |
| PUT    | /api/products/:id             | Update a product                   | Admin         |
| DELETE | /api/products/:id             | Delete a product                   | Admin         |
| GET    | /api/categories               | List all categories                | No            |
| GET    | /api/cart                     | Get current user's cart            | Yes           |
| POST   | /api/cart                     | Add item to cart                   | Yes           |
| PUT    | /api/cart/:itemId             | Update cart item quantity          | Yes           |
| DELETE | /api/cart/:itemId             | Remove item from cart              | Yes           |
| GET    | /api/wishlist                 | Get current user's wishlist        | Yes           |
| POST   | /api/wishlist                 | Add item to wishlist               | Yes           |
| DELETE | /api/wishlist/:productId      | Remove item from wishlist          | Yes           |
| POST   | /api/orders                   | Place an order                     | Yes           |
| GET    | /api/orders                   | List user's orders                 | Yes           |
| GET    | /api/orders/:id               | Get order details                  | Yes           |
| PUT    | /api/orders/:id/status        | Update order status                | Admin         |
| POST   | /api/products/:id/reviews     | Submit a product review            | Yes           |
| GET    | /api/products/:id/reviews     | Get reviews for a product          | No            |
| GET    | /api/search?q=                | Search products                    | No            |
| GET    | /api/recommendations          | Get personalised recommendations   | Yes           |
| GET    | /api/users                    | List all users                     | Admin         |
| GET    | /api/users/me                 | Get current user profile           | Yes           |
| PUT    | /api/users/me                 | Update current user profile        | Yes           |

## Docker Deployment

Build and start all services with a single command:

```bash
docker-compose up --build
```

| Service    | URL                        |
|------------|----------------------------|
| Storefront | http://localhost:3000       |
| Admin      | http://localhost:3001       |
| Backend    | http://localhost:4000/api  |
| PostgreSQL | localhost:5432              |

To stop all services:

```bash
docker-compose down
```

To remove volumes (wipes database data):

```bash
docker-compose down -v
```

## Environment Variables

Create `apps/backend/.env` based on the table below:

| Variable      | Description                              | Example                                                   |
|---------------|------------------------------------------|-----------------------------------------------------------|
| DATABASE_URL  | PostgreSQL connection string             | `postgresql://postgres:postgres@localhost:5432/myntra_db` |
| JWT_SECRET    | Secret key used to sign JWTs            | `super-secret-jwt-key-change-in-production`               |
| PORT          | Port the API server listens on          | `4000`                                                    |
| CORS_ORIGIN   | Allowed CORS origin for the storefront  | `http://localhost:3000`                                   |
| NODE_ENV      | Runtime environment                      | `development`                                             |

## Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│      Storefront          │     │     Admin Dashboard      │
│   Next.js  :3000         │     │   Next.js  :3001         │
└────────────┬────────────┘     └────────────┬────────────┘
             │                               │
             │        HTTP / REST API        │
             └──────────────┬────────────────┘
                            │
                ┌───────────▼───────────┐
                │      Backend API       │
                │  Express + Prisma :4000│
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │      PostgreSQL 15     │
                │       :5432            │
                └───────────────────────┘
```

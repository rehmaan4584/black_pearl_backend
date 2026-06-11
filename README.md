# Black Pearl Backend

NestJS REST API for the **Black Pearl** e-commerce platform. Powers both the customer storefront and the seller admin portal — products, cart, orders, Stripe payments, and Cloudinary image uploads.

**Live API:** https://rehman-bp-api.duckdns.org  
**Swagger docs:** https://rehman-bp-api.duckdns.org/api

## Architecture

```
Store (buyers)  ──┐
                  ├──►  Black Pearl API  ──►  PostgreSQL
Portal (sellers) ─┘         │
                              ├── Stripe (checkout + webhooks)
                              └── Cloudinary (product images)
```

## Tech stack

- **NestJS 11** · TypeScript · PostgreSQL · **Prisma 7**
- **JWT auth** (Passport) — `BUYER` and `SELLER` roles
- **Stripe** — Checkout Sessions + webhooks (PKR)
- **Cloudinary** — variant image uploads
- **Swagger** — interactive API docs at `/api`

## Features

| Module | Description |
|--------|-------------|
| Auth | Register, login, JWT-protected routes, role guards |
| Products & variants | Catalog with size/color variants, SKU, price, inventory |
| Categories & sub-categories | Product taxonomy |
| Sizes & colors | Lookup tables (managed from portal, used by variants) |
| Cart | Per-user cart with inventory validation |
| Orders | Create from cart, buyer/seller views, status workflow |
| Checkout | Stripe session creation, cancel flow, webhook handling |
| Images | Multipart upload → Cloudinary → `ProductVariantImage` |

**Order flow:** Cart → checkout session → Stripe payment → webhook marks `PAID` → seller ships → `DELIVERED`

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Stripe account (secret key + webhook secret)
- Cloudinary account

### Setup

```bash
git clone https://github.com/rehmaan4584/black_pearl_backend.git
cd black_pearl_backend
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=3003

DATABASE_URL=postgresql://user:password@localhost:5432/black_pearl

JWT_SECRET=your_jwt_secret

CORS_ORIGINS=http://localhost:3000,http://localhost:3001

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:3000/checkout/success
STRIPE_CANCEL_URL=http://localhost:3000/checkout/cancel
```

```bash
npx prisma migrate dev
npx prisma generate
npm run seed          # optional — seeds sizes & colors
npm run start:dev
```

API runs on `PORT` (default **3003** in production setup; **3000** if unset).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run production build |
| `npm run seed` | Seed sizes and colors |
| `npm run test` | Unit tests |

## Key API routes

| Area | Routes |
|------|--------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Products | `GET /products`, `POST /products/create` (seller) |
| Variants & images | `POST /product-variant/create`, `POST /product-variant-image/create` |
| Catalog data | `GET /categories`, `/sub-categories`, `/sizes`, `/colors` |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH/DELETE /cart/items/:id` |
| Orders | `POST /orders`, `GET /orders/my`, `PATCH /orders/:id/status` (seller) |
| Checkout | `POST /checkout/session`, `POST /checkout/cancel`, `POST /checkout/webhook` |

Full route list and request schemas: **Swagger UI** at `/api`.

## Database

Prisma schema: `prisma/schema.prisma`

Main models: `User`, `Product`, `ProductVariant`, `ProductVariantImage`, `Category`, `SubCategory`, `Size`, `Color`, `Inventory`, `Cart`, `CartItem`, `Order`, `OrderItem`.

## Related repos

- [black_pearl_store_frontend](https://github.com/rehmaan4584/black_pearl_store_frontend) — Customer storefront (Next.js, Stripe checkout) · [Live](https://rehman-bp-store.duckdns.org)
- [black_pearl_portal_frontend](https://github.com/rehmaan4584/black_pearl_portal_frontend) — Seller admin panel · [Live](https://rehman-bp-portal.duckdns.org)

## Author

Abdul Rehman

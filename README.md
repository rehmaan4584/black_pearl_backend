# Black Pearl Backend

A NestJS backend application with PostgreSQL database integration using Prisma ORM.

## Overview

This project is built with:
- **Framework**: NestJS (Node.js framework for building efficient, reliable server-side applications)
- **Database**: PostgreSQL
- **ORM**: Prisma (next-generation ORM with type safety)
- **Database Adapter**: Prisma Adapter for PostgreSQL (`@prisma/adapter-pg`)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- PostgreSQL (v18 or higher)

## Installation

1. **Clone the repository** and navigate to the project directory:
```bash
cd black_pearl_backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory with the following configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/zivorr_db"
```

Replace `user`, `password`, and `zivorr_db` with your PostgreSQL credentials.

## Database Setup

### Initialize Prisma

The Prisma configuration and schema are already set up in the `prisma/` directory:
- `schema.prisma` - Database schema definition
- `migrations/` - Database migration files

### Run Migrations

To apply database migrations:
```bash
npx prisma migrate dev
```
````markdown
# Black Pearl Backend

A NestJS backend application with PostgreSQL database integration using Prisma ORM.

## Overview

This project is built with:
- **Framework**: NestJS (Node.js framework for building efficient, reliable server-side applications)
- **Database**: PostgreSQL
- **ORM**: Prisma (next-generation ORM with type safety)
- **Database Adapter**: Prisma Adapter for PostgreSQL (`@prisma/adapter-pg`)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- PostgreSQL (v12 or higher)

## Installation

1. **Clone the repository** and navigate to the project directory:
```bash
cd black_pearl_backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory with the following configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/zivorr_db"
```

Replace `user`, `password`, and `zivorr_db` with your PostgreSQL credentials.

## Prisma schema (summary)

This project includes a Prisma schema at `prisma/schema.prisma`. Key points from the current schema:

- **Generator**:
    - `provider = "prisma-client"`
    - `output = "../src/generated/prisma"` (client is generated into `src/generated/prisma`)
    - `moduleFormat = "cjs"`

- **Datasource**:
    - `provider = "postgresql"`
    - Note: set `DATABASE_URL` in your `.env` (Prisma will use this to connect).

- **Models** (main entities):
    - `User` — fields: `id`, `name`, `email` (unique), `userType` (enum), `password`, optional contact/address fields, timestamps. Mapped to DB table `users`.
    - `Product` — fields: `id`, `title`, `description`, `type` (enum), `gender` (enum), `brand` (default `Black Pearl`), timestamps. Mapped to `products`.
    - `ProductVariant` — variant of a product: `productId` relation, `size` (enum), `color` (enum), `sku` (unique), `price`, an `images` relation to `ProductVariantImage`, optional `inventory`, and timestamps. Mapped to `product_variants`.
    - `ProductVariantImage` — stores image URLs for a `ProductVariant`: `id`, `url`, `isPrimary` (boolean), optional `sortOrder`, `productVariantId` relation, and timestamps. Mapped to `product_variant_images`.
    - `Order` — belongs to `User`, links to a `ProductVariant`, has `status` (enum) defaulting to `pending`, timestamps. Mapped to `orders`.
    - `OrderItem` — belongs to `Order`, references `ProductVariant`, `quantity`, `price`, timestamps. Mapped to `order_items`.
    - `Inventory` — one-to-one with `ProductVariant` (`productVariantId` is `@unique`), `quantity`, timestamps. Mapped to `inventory`.

- **Enums**:
    - `ProductGender`: `men`, `women`, `unisex`
    - `ProductTypes`: `jeans`, `shorts`
    - `ProductVariantSizes`: `S`, `M`, `L`, `XL`, `XXL`
    - `ProductVariantColors`: `black`, `blue`, `darkBlue`, `lightBlue`
    - `OrderStatus`: `pending`, `paid`, `shipped`, `delivered`, `cancelled`

    - `UserTypes`: `buyer`, `seller`

These models include relations (foreign keys) and mapping to specific table names using `@@map`.

## Database Setup

### Run Migrations

To apply database migrations (creates/updates tables according to `prisma/migrations`):
```bash
npx prisma migrate dev
```

If you add or change models, create a named migration:
```bash
npx prisma migrate dev --name add-foo
```

### Generate Prisma client

After schema changes (or after pulling the repo), run:
```bash
npx prisma generate
```

## Key Dependencies

### Database & ORM
- **@prisma/client** (^7.1.0) - Prisma ORM client for database operations
- **@prisma/adapter-pg** (^7.1.0) - PostgreSQL adapter for Prisma with native driver support
- **pg** (^8.16.3) - PostgreSQL client library

### NestJS Core
- **@nestjs/common** (^11.0.1) - Common NestJS utilities
- **@nestjs/core** (^11.0.1) - Core NestJS framework
- **@nestjs/platform-express** (^11.0.1) - Express adapter for NestJS
- **@nestjs/config** (^4.0.2) - Configuration management for environment variables

### Development Tools
- **prisma** (^7.1.0) - Prisma CLI for migrations and schema management
- **@types/pg** (^8.15.6) - TypeScript types for PostgreSQL client
- **typescript** (^5.7.3) - TypeScript compiler
- **ts-node** (^10.9.2) - TypeScript execution for Node.js

## Available Scripts

```bash
# Development
npm run start              # Start the application
npm run start:dev          # Start with file watching (development mode)
npm run start:debug        # Start with debugger attached
npm run start:prod         # Production start

# Building
npm run build              # Build the application for production

# Code Quality
npm run format             # Format code with Prettier
npm run lint               # Lint and fix code with ESLint

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage report
npm run test:debug         # Debug tests
npm run test:e2e           # Run end-to-end tests
```

## Project Structure

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
├── prisma.service.ts          # Prisma service for database operations
└── generated/                 # Auto-generated Prisma types and client
        └── prisma/
                ├── client.ts          # Generated Prisma client
                ├── models.ts          # Generated database models
                └── enums.ts           # Generated enums

prisma/
├── schema.prisma              # Database schema definition
└── migrations/                # Database migration history

test/
├── app.e2e-spec.ts           # End-to-end tests
└── jest-e2e.json             # E2E test configuration
```

## Database Connection

The application uses Prisma with a PostgreSQL adapter that leverages the native `pg` driver for improved performance. The connection is managed through the `PrismaService` class (`src/prisma.service.ts`):

```typescript
// Connection is automatically initialized when the module loads
// Database URL is read from DATABASE_URL environment variable
// Connection is gracefully closed when the application shuts down
```

## Development Workflow

1. **Make schema changes**: Update `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name <migration_name>`
3. **Generate client**: `npx prisma generate` (auto-run with migrate dev)
4. **Code changes**: Update your services and controllers
5. **Run tests**: `npm run test` or `npm run test:watch`
6. **Start dev server**: `npm run start:dev`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running and accessible
- Verify `DATABASE_URL` environment variable is correctly set
- Check PostgreSQL credentials and connection string

### Prisma Generation Issues
- Delete `node_modules/.prisma` folder
- Run `npm install` again
- Execute `npx prisma generate`

### TypeScript Errors
- Run `npm run build` to check compilation
- Ensure all generated types are up to date: `npx prisma generate`

## Author

[Abdul Rehman]

````

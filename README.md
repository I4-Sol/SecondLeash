# SecondLeash

**Mission-driven Dog Shelter Internal Management Platform**

A production-grade web application built for Italian dog shelters to manage their operations internally. SecondLeash provides authentication, role-based authorization, and comprehensive dogs management with clean architecture and long-term scalability.

---

## 🏗️ Architecture

### Tech Stack

- **Frontend:** Vue 3 + Vite + PrimeVue + Pinia + Vue Router
- **Backend:** Node.js (TypeScript) + Express + PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod (shared schemas)
- **Authentication:** JWT (access + refresh tokens) + bcrypt
- **Containerization:** Docker + Docker Compose

### Project Structure

```
SecondLeash/
├── apps/
│   ├── api/                # Backend API (Express + TypeScript)
│   │   ├   ├── src/
│   │   │   ├── config/        # Environment configuration
│   │   │   ├── middlewares/   # Auth, RBAC, validation, error handling
│   │   │   ├── modules/       # Feature modules (auth, dogs)
│   │   │   ├── shared/        # Shared utilities (logger, errors, schemas)
│   │   │   └── server.ts      # Express app entry point
│   │   └── package.json
│   └── web/                # Frontend (Vue 3 + Vite)
│       ├── src/
│       │   ├── assets/        # Styles and theme
│       │   ├── layouts/       # App layout components
│       │   ├── pages/         # Page components
│       │   ├── router/        # Vue Router configuration
│       │   ├── services/      # API client and services
│       │   ├── stores/        # Pinia state management
│       │   └── main.ts        # Vue app entry point
│       └── package.json
├── infra/
│   └── db/                 # Database (Prisma)
│       ├── schema.prisma      # Database schema
│       └── seed.ts            # Seed script
├── docker-compose.yml      # Docker orchestration
├── .env.example            # Environment variables template
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** and **Docker Compose**

### 1. Clone and Setup

```bash
cd /Users/joseandres/Documents/personal/SecondLeash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your configuration. For development, the defaults work fine, but **change JWT secrets**:

```env
# Critical: Change these in production!
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start with Docker Compose

```bash
docker compose up --build
```

This will:
- Start PostgreSQL on port 5432
- Run database migrations
- Start the API server on port 3000
- Start the web app on port 5173

### 5. Seed the Database

In a separate terminal:

```bash
docker compose exec api npm run seed --workspace=infra/db
```

Or if running locally:

```bash
cd infra/db
npm run seed
```

### 6. Access the Application

- **Web App:** http://localhost:5173
- **API:** http://localhost:3000
- **API Health Check:** http://localhost:3000/health

---

## 🔐 Default Credentials

### Development Users (seeded automatically)

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | admin@secondleash.com | Admin123! |
| **Shelter Admin** | shelter@secondleash.com | Shelter123! |
| **Staff** | staff@secondleash.com | Staff123! |
| **Volunteer** | volunteer@secondleash.com | Volunteer123! |

**⚠️ Change these credentials immediately in production!**

---

## 📚 Database Management

### Run Migrations

```bash
# With Docker
docker compose exec api npx prisma migrate deploy --schema=/app/infra/db/schema.prisma

# Locally
cd infra/db
npx prisma migrate dev
```

### Create New Migration

```bash
cd infra/db
npx prisma migrate dev --name your_migration_name
```

### Prisma Studio (Database GUI)

```bash
cd infra/db
npx prisma studio
```

### Reset Database

```bash
cd infra/db
npx prisma migrate reset
npm run seed
```

---

## 🛠️ Development

### Run Locally (without Docker)

**Start PostgreSQL:**
```bash
# Make sure PostgreSQL is running on localhost:5432
# Database: second_leash
# User: joseandres (or update DATABASE_URL in .env)
```

**Run Migrations:**
```bash
cd infra/db
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
```

**Start API:**
```bash
cd apps/api
npm install
npm run dev
```

**Start Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

### Testing

**Backend:**
```bash
cd apps/api
npm test
```

**Frontend:**
```bash
cd apps/web
npm test
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

---

## 🎨 Design System

SecondLeash uses a carefully selected color palette inspired by ocean and sky tones:

- **Primary:** Azure (`#007FFF`)
- **Secondary:** Deep Turquoise (`#00CED1`)
- **Accent/Success:** Sea Green (`#2E8B57`)
- **Text/Dark:** Midnight Blue (`#191970`)

Full palette is defined in `/apps/web/src/assets/theme.css`.

---

## 🔒 Security Features

- **Password Hashing:** bcrypt with 12 salt rounds
- **JWT Tokens:**
  - Access tokens: 15-minute TTL
  - Refresh tokens: 7-day TTL (stored as hash)
- **Token Rotation:** Refresh tokens are invalidated and rotated on each use
- **HTTP-only Cookies:** Refresh tokens stored in secure cookies
- **Rate Limiting:** Auth endpoints limited to 5 requests/minute
- **CORS:** Configured with explicit origin whitelist
- **Helmet:** Security headers enabled
- **Input Validation:** Zod schemas on all API endpoints
- **Generic Login Errors:** Prevents user enumeration

---

## 👥 Roles & Permissions

### RBAC Implementation

| Role | Dogs: View | Dogs: Create | Dogs: Edit | Dogs: Delete | Scope |
|------|-----------|-------------|-----------|-------------|-------|
| **SUPER_ADMIN** | ✅ All | ✅ All | ✅ All | ✅ All | All shelters |
| **SHELTER_ADMIN** | ✅ Own | ✅ Own | ✅ Own | ✅ Own | Own shelter only |
| **STAFF** | ✅ Own | ✅ Own | ✅ Own | ✅ Own | Own shelter only |
| **VOLUNTEER** | ✅ Own | ❌ | ❌ | ❌ | Own shelter only (read-only) |

**Shelter Scoping:** All queries automatically filter by user's shelter (except SUPER_ADMIN).

---

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (revoke refresh token)
- `GET /auth/me` - Get current user

### Dogs Management
- `GET /dogs` - List dogs (with optional status filter & pagination)
- `POST /dogs` - Create new dog
- `GET /dogs/:id` - Get dog details
- `PUT /dogs/:id` - Update dog
- `DELETE /dogs/:id` - Soft delete dog

All dogs endpoints require authentication and enforce shelter scoping.

---

## 🗄️ Database Schema

### Core Tables

- **users:** User accounts with roles and shelter assignments
- **shelters:** Shelter information
- **refresh_tokens:** Securely stored refresh tokens (hashed)
- **dogs:** Dog profiles with intake tracking and status

### Enums

- **Role:** `SUPER_ADMIN`, `SHELTER_ADMIN`, `STAFF`, `VOLUNTEER`
- **Sex:** `MALE`, `FEMALE`, `UNKNOWN`
- **Size:** `SMALL`, `MEDIUM`, `LARGE`, `XL`, `UNKNOWN`
- **DogStatus:** `AVAILABLE`, `ON_HOLD`, `ADOPTED`, `FOSTERED`, `MEDICAL`, `UNKNOWN`

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up

# Start in detached mode
docker compose up -d

# Rebuild and start
docker compose up --build

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Execute command in API container
docker compose exec api <command>

# Execute command in Web container
docker compose exec web <command>
```

---

## 🏭 Production Deployment

### Environment Configuration

For production:

1. Generate strong JWT secrets:
   ```bash
   openssl rand -base64 64
   ```

2. Update `.env` with production values:
   - Set `NODE_ENV=production`
   - Use strong, unique JWT secrets
   - Configure production database URL
   - Set proper CORS origins
   - Enable SSL/TLS for PostgreSQL

### Build for Production

```bash
# Build API
cd apps/api
npm run build

# Build Web
cd apps/web
npm run build
```

### Kubernetes Ready

The application structure supports future Kubernetes deployment:
- Env-based configuration (12-factor app)
- Health check endpoints
- Graceful shutdown handling
- Stateless API design
- Containerized services

---

## 🧪 Testing Checklist

### End-to-End Flow

1. ✅ Start stack: `docker compose up --build`
2. ✅ Run migrations: Automatic on API start
3. ✅ Run seed: `docker compose exec api npm run seed --workspace=infra/db`
4. ✅ Open http://localhost:5173
5. ✅ Login with `shelter@secondleash.com` / `Shelter123!`
6. ✅ View dashboard with statistics
7. ✅ Navigate to Dogs management
8. ✅ Create a new dog
9. ✅ Edit the dog
10. ✅ Soft delete the dog
11. ✅ Verify dog no longer appears in list
12. ✅ Logout

---

## 📋 Current Scope & Limitations

### ✅ Implemented

- Complete authentication with JWT access/refresh tokens
- Role-based authorization with shelter scoping
- Dogs CRUD with soft delete
- Responsive UI with PrimeVue
- Docker Compose development environment
- Database migrations and seeding
- Structured logging
- Input validation
- Security best practices

### 🚧 Out of Scope (Future Enhancements)

- External adoption marketplace/portal
- Password reset flow
- Email verification
- User profile management
- Image upload for dogs
- Medical records module
- Adoption workflow automation
- Audit logging
- Full OpenAPI documentation
- CI/CD pipelines
- Kubernetes manifests

---

## 🙏 Design Decisions & Assumptions

1. **Prisma over TypeORM:** Better TypeScript support, excellent migration system
2. **HTTP-only cookies for refresh tokens:** More secure than localStorage
3. **Soft delete:** Using `deleted_at` timestamp for better audit trail
4. **Shelter scoping at repository layer:** Centralized security enforcement
5. **Generic login errors:** Prevents user enumeration attacks
6. **15min access token TTL:** Balance between security and UX
7. **Bcrypt 12 rounds:** Industry standard for password hashing
8. **Monorepo with npm workspaces:** Simplifies dependency management
9. **No password reset in MVP:** Requires email infrastructure
10. **Local DB setup:** Uses provided credentials (no password for dev)

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker compose ps

# View database logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up --build
```

### Port Conflicts

If ports 3000, 5173, or 5432 are already in use, update `docker-compose.yml` or stop conflicting services.

### Migration Errors

```bash
# Reset Prisma client
cd infra/db
npx prisma generate

# Reset migrations
npx prisma migrate reset
```

---

## 📞 Support

For issues or questions about SecondLeash, please refer to this README or check the implementation plan in the project artifacts.

---

## 📄 License

Internal use for dog shelter operations. All rights reserved.

---

**Built with ❤️ for animal welfare**

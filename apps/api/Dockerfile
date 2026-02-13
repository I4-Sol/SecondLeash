FROM node:18-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY infra/db/package*.json ./infra/db/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy source code
COPY infra/db ./infra/db
COPY apps/api ./apps/api

# Generate Prisma client
WORKDIR /app/infra/db
RUN npx prisma generate

# Build API
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy built files and dependencies from builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/infra/db/schema.prisma ./schema.prisma

EXPOSE 3000

CMD ["node", "dist/server.js"]

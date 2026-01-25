# =============================================================================
# Multi-stage Dockerfile for NestJS Backend (Node.js Production)
# =============================================================================
# IMPORTANT: Build context must be /srv/workspace/game-plug (project root)
# Usage: docker build -f apps/backend/Dockerfile -t game-plug-backend .
#
# This Dockerfile uses a multi-stage approach to minimize the final image size
# Stage 1: Dependencies - Install production dependencies only
# Stage 2: Build - Compile TypeScript with all dependencies
# Stage 3: Production - Minimal runtime image with Node.js

# =============================================================================
# Stage 1: Production Dependencies
# =============================================================================
FROM node:24-alpine AS deps
WORKDIR /app/backend

# Copy backend package files
COPY apps/backend/package.json apps/backend/package-lock.json* ./

# Install production dependencies only (use install instead of ci due to lock file sync issues)
RUN npm install --legacy-peer-deps --omit=dev && \
    npm cache clean --force

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:24-alpine AS builder
WORKDIR /app

# Copy backend package files
COPY apps/backend/package.json apps/backend/package-lock.json* ./backend/

# Install all dependencies (including dev dependencies for build)
WORKDIR /app/backend
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy shared schema (required for TypeScript compilation)
WORKDIR /app
COPY shared ./shared

# Copy backend source code and build configuration
COPY apps/backend ./backend

# Create symlink for node_modules so shared schema can find dependencies
RUN ln -s /app/backend/node_modules /app/node_modules

# Build the NestJS application (with webpack to avoid some TypeScript strict issues)
WORKDIR /app/backend
RUN npm run build:webpack || npm run build

# =============================================================================
# Stage 3: Production Runtime
# =============================================================================
FROM node:24-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install runtime utilities
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy production dependencies from deps stage
COPY --from=deps /app/backend/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/backend/dist ./dist

# Copy package.json for runtime
COPY --from=builder /app/backend/package.json ./package.json

# Copy shared schema (required at runtime for drizzle-orm)
COPY --from=builder /app/shared ./shared

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start application with Node.js
CMD ["node", "dist/backend/src/main.js"]

# =============================================================================
# Multi-stage Dockerfile for NestJS Backend
# =============================================================================
# This Dockerfile uses a multi-stage approach to minimize the final image size
# Stage 1: Dependencies - Install all dependencies
# Stage 2: Build - Compile TypeScript
# Stage 3: Production - Minimal runtime image

# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM oven/bun:1.3.6-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* bun.lockb* ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile || npm ci

# =============================================================================
# Stage 2: Build
# =============================================================================
FROM oven/bun:1.3.6-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and build configuration
COPY . .

# Build the NestJS application
RUN bun run build || npm run build

# =============================================================================
# Stage 3: Production Runtime
# =============================================================================
FROM oven/bun:1.3.6-alpine

WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache \
    dumb-init \
    wget \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from deps stage (production-only)
COPY --from=deps /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy configuration files
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs bun.lockb* package-lock.json* ./

# Copy shared schemas and migrations
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/drizzle.config.ts* ./

# Create directories with correct permissions
RUN mkdir -p /app/public/avatars && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 5002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5002/api/health || exit 1

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start application with Bun
CMD ["bun", "run", "start"]

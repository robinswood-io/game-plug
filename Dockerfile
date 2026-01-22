# Multi-stage build for Rôle Plug application with Bun

# Stage 1: Dependencies
FROM oven/bun:1.3.6-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
# Install all dependencies including devDependencies
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1.3.6-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application (frontend + backend)
RUN bun run build

# Stage 3: Production
FROM oven/bun:1.3.6-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/bun.lockb ./

# Copy schema and drizzle config for database migrations
COPY --from=builder --chown=nodejs:nodejs /app/shared ./shared
COPY --from=builder --chown=nodejs:nodejs /app/drizzle.config.ts ./drizzle.config.ts

# Create directories for avatars and ensure correct permissions
RUN mkdir -p /app/public/avatars && \
    chown -R nodejs:nodejs /app/public

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 5000

# Health check (using bun instead of node)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun -e "const http = require('http'); http.get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application with Bun
CMD ["bun", "start"]

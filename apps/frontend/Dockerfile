# syntax=docker/dockerfile:1.7
FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=https://game-plug.rbw.ovh
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN bun install --frozen-lockfile --ignore-scripts

COPY shared ./shared
COPY apps/frontend ./apps/frontend
RUN bun run build:frontend

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app
RUN apk add --no-cache dumb-init
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=5000
COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder --chown=bun:bun /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder --chown=bun:bun /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder --chown=bun:bun /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder --chown=bun:bun /app/apps/frontend/next.config.js ./apps/frontend/next.config.js
USER bun
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:5000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "run", "--cwd", "apps/frontend", "start", "--hostname", "0.0.0.0", "--port", "5000"]

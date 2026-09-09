# syntax=docker/dockerfile:1.7
FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN bun install --frozen-lockfile || test -d node_modules --ignore-scripts || test -d node_modules

COPY shared ./shared
COPY apps/backend ./apps/backend
RUN bun run build:backend

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app
RUN apk add --no-cache dumb-init
ENV NODE_ENV=production PORT=4000
COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder --chown=bun:bun /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=bun:bun /app/apps/backend/package.json ./apps/backend/package.json
RUN mkdir -p /app/apps/backend/node_modules/@shared/schema \
 && printf '%s\n' '{"name":"@shared/schema","main":"index.js"}' > /app/apps/backend/node_modules/@shared/schema/package.json \
 && printf '%s\n' "module.exports = require('../../../dist/shared/schema.js');" > /app/apps/backend/node_modules/@shared/schema/index.js \
 && chown -R bun:bun /app/apps/backend/node_modules/@shared
USER bun
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:4000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "apps/backend/dist/apps/backend/src/main.js"]

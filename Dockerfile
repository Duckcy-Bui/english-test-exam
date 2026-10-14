FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    EXAM_DATA_DIR=/app/data/units \
    RATE_LIMIT_DB=/var/lib/english-it/rate-limits.sqlite
RUN groupadd --system --gid 1001 nextjs \
    && useradd --system --uid 1001 --gid nextjs --no-create-home --home-dir /app nextjs \
    && mkdir -p /var/lib/english-it \
    && chown nextjs:nextjs /app /var/lib/english-it
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/data/units ./data/units
COPY --from=builder --chown=nextjs:nextjs /app/data/audio ./data/audio
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=6s --start-period=30s --retries=3 \
    CMD ["node", "--input-type=module", "-e", "try { const response = await fetch('http://127.0.0.1:3000/api/health', { signal: AbortSignal.timeout(5000) }); process.exit(response.ok ? 0 : 1); } catch { process.exit(1); }"]
CMD ["node", "server.js"]

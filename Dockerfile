# syntax=docker/dockerfile:1

# ── Build Stage ──
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production=false
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Production Stage ──
FROM node:22-alpine AS runner
RUN apk add --no-cache python3 make g++
WORKDIR /app
RUN mkdir -p /app/data
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# better-sqlite3 native binary
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

EXPOSE 3000
CMD ["node", "server.js"]

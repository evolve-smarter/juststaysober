FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Generate Prisma Client
FROM base AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate

# Build the application
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN npm run build

# Production image
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Release tooling. The standalone output has no Prisma CLI, schema or migrations, so the
# pre-deploy step (deploy/predeploy.sh) needs them. The CLI lives in its own folder so it
# cannot disturb the app's traced node_modules. Keep PRISMA_VERSION equal to package.json.
ARG PRISMA_VERSION=6.19.2
RUN mkdir /migrate && cd /migrate && npm init -y >/dev/null 2>&1 && npm install --no-audit --no-fund prisma@${PRISMA_VERSION} && chown -R nextjs:nodejs /migrate
COPY --chown=nextjs:nodejs prisma ./prisma
COPY --chown=nextjs:nodejs deploy ./deploy

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

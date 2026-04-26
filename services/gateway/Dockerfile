FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/gateway/package.json ./services/gateway/
RUN pnpm install --frozen-lockfile --filter gateway

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/gateway/node_modules ./services/gateway/node_modules
COPY services/gateway ./services/gateway
COPY package.json pnpm-workspace.yaml ./
RUN pnpm --filter gateway build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/gateway/dist ./dist
COPY --from=deps /app/services/gateway/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]

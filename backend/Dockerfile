FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

WORKDIR /app/backend
RUN npm ci --ignore-scripts

COPY backend/src ./src

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY shared ./shared
COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm ci --only=production --ignore-scripts

COPY --from=base /app/backend/dist ./dist

USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

CMD ["node", "dist/server.js"]
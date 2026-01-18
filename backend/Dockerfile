FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY ./src ./src

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=base /app/dist ./dist

USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

CMD ["node", "dist/server.js"]
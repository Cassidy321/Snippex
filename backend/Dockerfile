FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY ./src ./src

RUN npm run build

FROM node:lts-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=base /app/dist ./dist

USER node

EXPOSE 8000
CMD ["node", "dist/server.js"]
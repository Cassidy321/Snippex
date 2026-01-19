FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend
RUN npm ci --ignore-scripts

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend
RUN npm ci --ignore-scripts

COPY frontend/index.html frontend/tsconfig*.json frontend/vite.config.ts ./
COPY frontend/src ./src

RUN npm run build

FROM nginx:1.27-alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY frontend/nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/frontend/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

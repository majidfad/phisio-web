FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_MAX_EXERCISE_UPLOAD_BYTES=524288000
ARG VITE_UPLOAD_TIMEOUT_MS=600000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MAX_EXERCISE_UPLOAD_BYTES=$VITE_MAX_EXERCISE_UPLOAD_BYTES
ENV VITE_UPLOAD_TIMEOUT_MS=$VITE_UPLOAD_TIMEOUT_MS

RUN npm run build

FROM nginx:1.27-alpine AS runtime

# CLIENT_MAX_BODY_SIZE is substituted by the nginx image entrypoint at start.
ENV CLIENT_MAX_BODY_SIZE=500m
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null || exit 1

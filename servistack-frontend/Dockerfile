FROM node:22-alpine AS construccion
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
RUN apk add --no-cache gettext
COPY Caddyfile /etc/caddy/Caddyfile
COPY configuracion.json.template /etc/servistack/configuracion.json.template
COPY --from=construccion /app/dist/servistack-web/browser /usr/share/caddy
EXPOSE 80
CMD ["sh", "-c", "envsubst < /etc/servistack/configuracion.json.template > /usr/share/caddy/configuracion.json && exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]

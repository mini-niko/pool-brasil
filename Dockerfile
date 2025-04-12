FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/.next ./.next/
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/infra/migrations ./infra/migrations

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]

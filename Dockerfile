# Etapa 1: Build del frontend
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Etapa 2: Producción con servidor Node (si usas react-router-serve o similar)
FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copiar solo el build final
COPY --from=builder /app/build /app/build

EXPOSE 3000

# Usa tu servidor (ajusta según tu config)
CMD ["yarn", "start"]

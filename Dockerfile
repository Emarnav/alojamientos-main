# Imagen base
FROM node:20-slim

# Dependencias necesarias para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos manifests primero para cache
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Instalar dependencias en la raíz (dispara postinstall => prisma generate en /app)
RUN npm install

# Instalar deps del client y server (no instalan prisma otra vez)
RUN cd client && npm install
RUN cd server && npm install

# Copiar el resto del código
COPY . .

# Build del frontend (Next.js)
RUN cd client && npm run build

# (Opcional) Build del backend si tienes script
RUN cd server && npm run build || echo "No server build step"

# Crear baseline por si la BD ya tiene tablas
RUN mkdir -p server/prisma/migrations/0000_baseline \
 && echo "-- baseline" > server/prisma/migrations/0000_baseline/migration.sql

# Exponer puerto
EXPOSE 3000

# Entorno
ENV NODE_ENV=production
ENV PORT=3000

# Command de arranque:
# 1) (idempotente) prisma generate en /app usando el schema de server (por si cambió la imagen/env)
# 2) migrate deploy o baseline si es la primera vez
# 3) arrancar tu servidor combinado desde la raíz (server.js)
CMD sh -lc '\
  cd /app && npx prisma generate --schema=server/prisma/schema.prisma && \
  cd server && (npx prisma migrate deploy || npx prisma migrate resolve --applied 0000_baseline) && \
  cd /app && node server.js'

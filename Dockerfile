# Imagen base
FROM node:20-slim

# Dependencias de sistema para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar manifests para cache eficiente
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Instalar dependencias
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copiar código
COPY . .

# Build del frontend (Next.js)
RUN cd client && npm run build

# Build del backend (si existe script build)
RUN cd server && npm run build || echo "No server build step"

# Generar Prisma Client durante el build (usa el schema del backend)
RUN cd server && npx prisma generate --schema=prisma/schema.prisma

# Crear baseline por si la BD ya tiene tablas (evita P3005 la primera vez)
RUN mkdir -p server/prisma/migrations/0000_baseline \
 && echo "-- baseline" > server/prisma/migrations/0000_baseline/migration.sql

# Exponer puerto
EXPOSE 3000

# Entorno
ENV NODE_ENV=production
ENV PORT=3000

# ⚠️ Prioriza server/node_modules para que @prisma/client cargue el generado ahí
ENV NODE_PATH=/app/server/node_modules:/app/client/node_modules:/app/node_modules

# Inicio:
# 1) Genera prisma client en runtime (por si cambia imagen/volúmenes)
# 2) Aplica migraciones (o marca baseline si es primera vez)
# 3) Arranca tu server.js (Next + API)
CMD sh -lc '\
  cd /app && npx prisma generate --schema=server/prisma/schema.prisma && \
  cd server && (npx prisma migrate deploy || npx prisma migrate resolve --applied 0000_baseline) && \
  cd /app && node server.js'

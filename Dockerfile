# Imagen base
FROM node:20-slim

# Dependencias de sistema para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copiar manifests para aprovechar cache
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Instalar dependencias (raíz, client, server)
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copiar el código
COPY . .

# Build Next.js del frontend
RUN cd client && npm run build

# (Opcional) Build del server si tienes script build en server/
RUN cd server && npm run build || echo "No server build step"

# Generar Prisma Client en build (usando el schema del backend)
RUN cd server && npx prisma generate --schema=prisma/schema.prisma

# Crear baseline por si la BD ya tiene tablas (evita P3005 la primera vez)
RUN mkdir -p server/prisma/migrations/0000_baseline \
 && echo "-- baseline" > server/prisma/migrations/0000_baseline/migration.sql

# Exponer puerto
EXPOSE 3000

# Entorno
ENV NODE_ENV=production
ENV PORT=3000

# IMPORTANTE: que Node pueda resolver módulos desde client/ y server/
# (p.ej. require('next') desde server.js en la raíz)
ENV NODE_PATH=/app/node_modules:/app/client/node_modules:/app/server/node_modules

# Comando de inicio:
# 1) Genera Prisma Client de nuevo en runtime (evita @prisma/client did not initialize)
# 2) Aplica migraciones o marca baseline si es la primera vez
# 3) Arranca tu servidor combinado desde la raíz
CMD sh -lc '\
  cd /app && npx prisma generate --schema=server/prisma/schema.prisma && \
  cd server && (npx prisma migrate deploy || npx prisma migrate resolve --applied 0000_baseline) && \
  cd /app && node server.js'

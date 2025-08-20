FROM node:20-slim

# Dependencias de sistema para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1) Copiamos solo manifests para cache
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# 2) Instalar deps SIN scripts (evita postinstall antes de tener el schema)
RUN npm install --ignore-scripts
RUN cd client && npm install --ignore-scripts
RUN cd server && npm install --ignore-scripts


# 3) Copiamos el código fuente
COPY . .

# 4) Ahora sí: generar Prisma Client (con el schema del backend) en la ubicación correcta
RUN npx prisma generate --schema=server/prisma/schema.prisma

# 5) Build Next.js
RUN cd client && npm run build

# 6) Build backend (si existe script)
RUN cd server && npm run build || echo "No server build step"

# 7) Baseline por si la BD ya tiene tablas (evita P3005 en primer arranque)
RUN mkdir -p server/prisma/migrations/0000_baseline \
 && echo "-- baseline" > server/prisma/migrations/0000_baseline/migration.sql

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# 8) Arranque:
#    - migrate deploy (o baseline si primera vez)  
#    - lanzar server.js (Next + API) - Prisma ya está generado
CMD ["sh","-lc", "\
  npx prisma migrate deploy --schema=server/prisma/schema.prisma || \
  npx prisma migrate resolve --applied 0000_baseline --schema=server/prisma/schema.prisma; \
  node server.js \
"]

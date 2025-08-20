# Imagen base
FROM node:20-slim

# Instalar dependencias del sistema para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copiar package.json files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Instalar dependencias
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN cd server && npx prisma generate

# Build de Next.js
RUN cd client && npm run build

# Build del servidor
RUN cd server && npm run build

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["sh", "-c", "cd server && npx prisma migrate deploy && cd .. && node server.js"]
# Usar imagen con Chromium incluido en lugar de Alpine
FROM node:20.11.1-bullseye-slim

WORKDIR /app

# Instalar dependencias del sistema para Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

COPY . .

# Build
RUN npm run build

EXPOSE 3000

# Configurar variable de entorno para Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["npm", "run", "start:prod"]
FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src

# prisma.config.ts exige DATABASE_URL ao carregar; `generate` não conecta ao DB.
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" npx prisma generate

EXPOSE 8080 8081

# Comando padrão: API + WS no mesmo processo. Em docker-compose, `api` e `ws` sobrescrevem o comando.
CMD ["npm", "run", "start"]

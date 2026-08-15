FROM node:18-alpine

RUN apk add --no-cache openssl libssl3

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages
COPY backend ./backend

RUN npm install
RUN npx prisma generate --schema=backend/prisma/schema.prisma

CMD sh -c "npx prisma db push --schema=backend/prisma/schema.prisma --skip-generate --accept-data-loss && npx tsx backend/src/server.ts"

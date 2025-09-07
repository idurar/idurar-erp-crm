FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8888

CMD ["npm", "run", "start"]
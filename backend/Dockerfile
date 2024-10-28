FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8888

CMD ["npm", "run", "dev"]
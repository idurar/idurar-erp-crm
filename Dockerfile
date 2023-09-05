FROM node:16-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .



RUN npm run setup


EXPOSE 8888

CMD ["npm", "run", "dev"]



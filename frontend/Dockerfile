FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_BACKEND_SERVER=/
ARG VITE_FILE_BASE_URL=/
ARG VITE_WEBSITE_URL=/
ENV VITE_BACKEND_SERVER=$VITE_BACKEND_SERVER
ENV VITE_FILE_BASE_URL=$VITE_FILE_BASE_URL
ENV VITE_WEBSITE_URL=$VITE_WEBSITE_URL
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

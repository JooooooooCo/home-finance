FROM node:19.3.0-alpine

WORKDIR /app

COPY . .

CMD npm install -g @vue/cli @vue/cli-service-global && npm install

EXPOSE 8080
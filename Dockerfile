FROM node:19.3.0-alpine

WORKDIR /app

COPY . .

CMD npm install -g @vue/cli && npm install

EXPOSE 8080
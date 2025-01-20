FROM node:19.3.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]

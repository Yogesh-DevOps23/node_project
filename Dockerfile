FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "printenv | grep -E 'DB_|PORT=' > .env && npm start"]

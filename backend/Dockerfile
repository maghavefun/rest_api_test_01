FROM node:20.11.1

WORKDIR /app/backend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8888

CMD [ "npm","run","start:dev"]
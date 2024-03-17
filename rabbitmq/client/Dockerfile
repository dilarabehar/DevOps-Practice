FROM node:12.12.0-alpine

WORKDIR /home/app/client

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./



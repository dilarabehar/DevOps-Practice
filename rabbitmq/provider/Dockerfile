FROM node:12.12.0-alpine

WORKDIR /home/app/provider

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./



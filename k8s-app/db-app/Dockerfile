FROM node:12.12.0-alpine

WORKDIR /home/app/db-app

RUN npm install

COPY package.json ./
COPY package-lock.json ./



COPY . ./
FROM node:14-alpine3.10 as build-step
RUN apk add --update --no-cache autoconf libtool automake nasm gcc make g++ zlib-dev

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm run buildServer

EXPOSE 8080
CMD [ "npm", "run", "prod" ]

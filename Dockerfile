FROM node:12.19.1-alpine3.10 as build-step
RUN apk add --update --no-cache autoconf libtool automake nasm gcc make g++ zlib-dev

WORKDIR /usr/src/app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn run build
RUN yarn run buildServer

EXPOSE 8080
CMD [ "npm", "run", "prod" ]

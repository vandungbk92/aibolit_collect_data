FROM node:14-alpine3.10
RUN apk add --update --no-cache autoconf libtool automake nasm gcc make g++ zlib-dev

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn run build
RUN yarn run buildServer

EXPOSE 8080
CMD [ "npm", "run", "prod" ]

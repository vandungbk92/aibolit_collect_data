FROM node:14-alpine3.10
RUN apk add --update --no-cache autoconf libtool automake nasm gcc make g++ zlib-dev fontconfig openssl wget
RUN apk add ca-certificates && update-ca-certificates
# Add phantomjs
RUN wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz" | tar xz -C / \
    && npm config set user 0 \
    && npm install -g phantomjs-prebuilt
# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn run build
RUN yarn run buildServer

EXPOSE 8080
CMD [ "npm", "run", "prod" ]

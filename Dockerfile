FROM ubuntu:18.04

RUN apt-get update \
 && apt-get install -y curl \
 && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
 && apt-get install -y nodejs

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm run buildServer

EXPOSE 8080
CMD [ "npm", "run", "prod" ]

FROM node:current-slim

WORKDIR /usr/src/app
COPY package*.json ./
COPY webpack ./webpack
COPY src ./src
COPY pwa ./pwa
COPY typings ./typings
COPY tsconfig.json ./

RUN npm install

RUN npm run build

EXPOSE 5000
EXPOSE 8080
CMD [ "npm", "run", "serve" ]

COPY . .

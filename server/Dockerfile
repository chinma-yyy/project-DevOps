FROM node:18

WORKDIR /server

COPY package*.json .

RUN npm ci

COPY . .

CMD [ "npm","start" ]
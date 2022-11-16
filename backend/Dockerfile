FROM node:16-alpine

WORKDIR /ng-cash-challenge

COPY . .

RUN npm install -g npm@latest

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]
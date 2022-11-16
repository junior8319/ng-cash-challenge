FROM node:16-alpine

WORKDIR /ng-cash-challenge

COPY . .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
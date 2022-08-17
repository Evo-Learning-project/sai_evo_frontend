FROM node:16.15.1-alpine

RUN apk update && apk upgrade --no-cache
RUN apk add git
RUN apk add g++ make py3-pip

RUN npm install -g @vue/cli
RUN npm install -g @vue/cli-service

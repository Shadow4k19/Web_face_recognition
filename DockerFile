FROM node:20-alpine AS build

WORKDIR /app

COPY  build/ ./build/

ENV PATH /app/node_modules/ .bin:$PATH

RUN npm i -g serve

CMD [ "serve","-s","build" ]


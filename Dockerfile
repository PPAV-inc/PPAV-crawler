FROM node:12

WORKDIR /home/app

COPY ./.babelrc ./.babelrc
COPY ./bin ./bin
COPY ./src ./src
COPY ./.env ./.env
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn

CMD ["yarn", "crawler:video"]

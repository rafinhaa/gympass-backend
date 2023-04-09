FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock tsup.config.ts ./

COPY ./src /app/src

RUN yarn install --frozen-lockfile --production

COPY ./prisma/migrations /app/prisma/migrations

RUN yarn build

RUN yarn cache clean && rm -rf src tsup.config.ts

CMD ["yarn", "prod"]

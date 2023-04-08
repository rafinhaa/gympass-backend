FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY ./src /app/src

RUN yarn install --frozen-lockfile --production

COPY ./prisma/migrations /app/prisma/migrations

RUN yarn add tsup@6.6.3 && yarn tsup src '!src/**/__tests__' --out-dir build --clean --minify && yarn remove tsup

RUN yarn cache clean && rm -rf src

CMD ["yarn", "prod"]

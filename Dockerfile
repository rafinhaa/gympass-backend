FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock tsup.config.ts tsconfig.json ./

COPY ./src /app/src

RUN yarn install --frozen-lockfile --production

COPY ./prisma/migrations /app/prisma/migrations

COPY ./prisma/schema.prisma /app/prisma/schema.prisma

RUN yarn build

RUN yarn cache clean && rm -rf src tsup.config.ts tsconfig.json

CMD ["yarn", "prod"]

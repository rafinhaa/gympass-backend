# Use node:18-alpine as the base image
FROM node:18-alpine

# Set the working directory
COPY . /app

# Set the working directory to /app
WORKDIR /app

# Install dependencies in production mode
RUN yarn --frozen-lockfile

# Run yarn build
RUN yarn run build

# Run migrations
RUN npx prisma migrate deploy

# Exclude files
RUN find /app ! -name 'build' ! -name 'node_modules' -type f -exec rm -rf {} +

# Set the command to start the app
CMD ["node", "/app/build/server.js"]

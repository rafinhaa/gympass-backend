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

# Set the command to start the app
CMD ["node", "/app/build/server.js"]

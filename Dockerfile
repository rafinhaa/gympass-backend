# Use node:18-alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy all files to the container's /home/app-build directory
COPY . /home/app-build

# Set the working directory to /home/app-build
WORKDIR /home/app-build

# Install dependencies in production mode
RUN yarn install --production

# Run yarn build
RUN yarn run build

# Copy the build files to /app directory
RUN cp -R build/. /app/

# Clear out /home/app-build directory
RUN rm -rf /home/app-build/*

# Set the working directory back to /app
WORKDIR /app

# Set the command to start the app
CMD ["node", "/app/server.js"]

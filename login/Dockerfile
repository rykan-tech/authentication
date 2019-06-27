# Dockerfile for login microservice
FROM node:lts as builder

# Change user
RUN useradd -ms /bin/bash login-service
USER login-service

# Change working dir
RUN mkdir ~/login
WORKDIR /home/login-service/login

# Copy code
COPY ./ ./

# Global deps, for building
RUN yarn global add typescript

# Build code
# Get ready
ARG CACHEBUST=1
RUN yarn install

# Build
RUN yarn run build

# Remove global deps
RUN yarn global remove typescript


# Use a separate container to run
FROM node:lts-alpine
# Env vars
ENV NODE_ENV=production

# Expose the port
EXPOSE 2000

# Start on command
CMD [ "node", "./lib/index.js" ]
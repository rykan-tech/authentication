# Dockerfile for login microservice
FROM node:lts as builder

# Change user
RUN useradd -ms /bin/bash login-service-builder
USER login-service-builder

# Change working dir
RUN mkdir ~/login
WORKDIR /home/login-service-builder/login

# Copy code
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src/
COPY ./private ./private/
COPY ./defs ./defs

# Global deps, for building
RUN yarn global add typescript

# Build code
# Get ready
RUN yarn install

# Build
RUN yarn run build

# Remove global deps
RUN yarn global remove typescript


# Use a separate container to run
FROM node:lts-alpine

# Change user
RUN addgroup -S login-service-group && adduser -S login-service -G login-service-group

# COPY
COPY --from=builder /home/login-service-builder/login /home/login-service/login/

WORKDIR /home/login-service/login

RUN chown :login-service-group /home/login-service/login && mkdir logs

USER login-service

# Expose the port
EXPOSE 2000

# Env vars
ENV NODE_ENV=production
ENV RYKAN_API_DEFS_DIR=/home/login-service/login/defs

# Start on command
CMD [ "node", "./lib/index.js" ]
# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:lts-bookworm-slim

# Install OpenSSL 3.0
RUN apt-get update && \
    apt-get install -y libssl-dev && \
    apt-get clean


# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy the application code.
COPY . .

# Copy the Prisma schema (assuming it is located at ../prisma from the context)
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the application (if applicable).
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

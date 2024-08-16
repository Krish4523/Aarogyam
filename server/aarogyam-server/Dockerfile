# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy the application code.
COPY . .

# Build the application (if applicable).
# RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code
COPY . .

# Expose internal port (must match the app’s running port)
EXPOSE 8080

# Default command (can be overridden in docker-compose.yml)
CMD ["npm", "run", "dev"]

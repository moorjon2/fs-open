# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port 3001
EXPOSE 3001

# Command to run your server
CMD ["npm", "start"]

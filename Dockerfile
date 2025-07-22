FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

RUN npm install -g serve

# Copy the rest of your application files
COPY . .

RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
ENTRYPOINT ["serve", "-s", "dist"]

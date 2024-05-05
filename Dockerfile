FROM node:18-alpine3.17

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker's layer caching
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Run Prisma migrations
RUN npx prisma db push

# Expose the port your application listens on (if applicable)
EXPOSE 3000

RUN npm run build

# Start the application
CMD ["npm", "start"]
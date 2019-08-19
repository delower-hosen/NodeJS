# Deifne a base image
FROM node:10

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN npm install

# Bundle app source
COPY . /app

# Run Command
CMD [ "npm", "start" ]
EXPOSE 3000

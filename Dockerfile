FROM node:latest

#Set working directory
WORKDIR /app

#Copy package.json and package-lock.json for server and install dependencies
COPY ./server/package.json ./server/
# RUN cd ./server && npm install

# #Copy the rest of the server files
# COPY ./server ./server/

# #Expose port 3001 for the server
# EXPOSE 3001

# #Copy package.json and package-lock.json for client and install dependencies
# COPY ./client/package.json ./client/
# RUN cd ./client && npm install

# #Copy the rest of the client files
# COPY ./client ./client/

# #Expose port 3000 for the client
# EXPOSE 3000

# #Start both server and client concurrently
# CMD ["npm", "run", "start"]
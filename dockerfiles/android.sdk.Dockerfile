FROM runmymind/docker-android-sdk:latest

# Create app directory
WORKDIR /usr/src/app

# Update Node
RUN npm cache clean -f
RUN npm install -g n
RUN n stable

RUN npm install -g nativescript
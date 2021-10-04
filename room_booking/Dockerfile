FROM node:latest
WORKDIR /usr/app
COPY package.json .
RUN npm install node-pre-gyp -g
RUN npm install
COPY . .
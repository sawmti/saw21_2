FROM node:12.14.1
WORKDIR /usr/src/app
COPY . ./
RUN npm install --production
CMD [ "node", "server.js" ]
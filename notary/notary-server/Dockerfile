FROM node:6

WORKDIR /notary
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 5000

CMD [ "npm", "start" ]
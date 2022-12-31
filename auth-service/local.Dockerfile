FROM node:16.18.0-alpine
WORKDIR /code
COPY package.json .
COPY yarn.lock .
RUN #yarn
COPY . .

CMD ["yarn", "start:dev"]

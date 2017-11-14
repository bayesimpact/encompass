FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

ADD src /usr/src/app/src

EXPOSE 8081

RUN yarn
RUN yarn build

CMD ["yarn", "start:docker"]

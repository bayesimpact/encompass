FROM node:9.11.1

ENV MAPBOX_TOKEN "$MAPBOX_TOKEN"

# Set up nginx to proxy requests.
# Should probably switch to express since we are in a node container anyway.
RUN apt-get update; apt-get -y install nginx

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./frontend/. /usr/src/app

COPY ./shared /usr/src/shared

EXPOSE 8081

RUN yarn
RUN yarn run build:prod

CMD ["yarn", "run", "start:prod"]

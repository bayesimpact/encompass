FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN git clone https://github.com/bayesimpact/tds-frontend.git
WORKDIR /usr/src/app/tds-frontend

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8081

FROM mongo:latest

RUN mkdir /data/localdb && chown mongodb /data/localdb
RUN apt-get -qq update
RUN apt-get -qqy install curl && apt-get install -qqy psmisc && apt-get install -qqy build-essential

# Download data.
COPY Makefile ./
RUN make all-full-datasets

COPY populate.sh ./
RUN gosu mongodb /bin/bash ./populate.sh --dbpath=/data/localdb

CMD ["mongod",  "--dbpath=/data/localdb"]

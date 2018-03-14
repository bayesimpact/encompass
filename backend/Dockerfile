FROM tiangolo/uwsgi-nginx-flask:python3.6

RUN apt-get -qq update && \
    apt-get install -y \
    libgeos-dev \
    libspatialindex-dev \
    gdal-bin \
    postgresql-client \
    man \
    unzip \
    --fix-missing \
    > /dev/null

COPY ./app/main.py /app/main.py
COPY ./lib /usr/local/lib/python3.6/site-packages/backend/lib
COPY ./app /usr/local/lib/python3.6/site-packages/backend/app

# UWSGI and NGINX configs
COPY ./config/uwsgi.ini /app/uwsgi.ini
COPY ./config/nginx.conf /etc/nginx/conf.d/nginx.conf

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/usr/bin/supervisord"]

EXPOSE 8080

COPY requirements.txt ./requirements.txt
RUN pip -q install -r ./requirements.txt

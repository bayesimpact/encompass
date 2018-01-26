FROM jupyter/base-notebook:latest

RUN conda install --yes --no-pin \
  geopandas \
  statsmodels \
  seaborn

RUN conda install --yes -c esri arcgis

USER root
RUN apt-get -qq update
RUN apt-get install -y \
    libgeos-dev \
    libspatialindex-dev \
    gdal-bin \
    man \
    gcc \
    --fix-missing
USER jovyan

WORKDIR /home/jovyan/work
RUN cd /home/jovyan/work

COPY ./backend/requirements.txt .
COPY ./explorer/explorer_requirements.txt .
RUN pip install -r requirements.txt
RUN pip install -r explorer_requirements.txt

EXPOSE 8888
ENV NODE_ENV development

FROM jupyter/base-notebook:latest

USER root
RUN sudo apt-get -qq update
RUN sudo apt-get -y install gcc
USER jovyan

RUN conda install --yes --no-pin \
 geopandas \
 statsmodels \
 seaborn

RUN conda install --yes -c esri arcgis

WORKDIR /home/jovyan/work
RUN cd /home/jovyan/work

COPY ./requirements.txt .
RUN pip install -r requirements.txt

EXPOSE 8888
ENV NODE_ENV development

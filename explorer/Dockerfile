FROM jupyter/base-notebook:latest

RUN conda install --yes --no-pin \
  geopandas \
  statsmodels \
  seaborn

RUN conda install --yes -c esri arcgis

COPY ./requirements.txt .
RUN pip install -r requirements.txt

FROM jupyter/base-notebook:latest

RUN conda install --yes --no-pin \
  geopandas \
  statsmodels \
  seaborn

COPY ./requirements.txt .
RUN pip install -r requirements.txt


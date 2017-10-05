Network Adequacy: Time and Distance Standards


# Local development

- Clone this repo
- Build and start docker service
```
docker-compose up -d explorer
```
- Open a browser and navigate to `localhost:8888`

This environment gives you the following:
- geopandas
- scikit-learn
- statsmodels
- seaborn

Add more needed dependecies to `requirements.txt` file, and rebuild you docker images:
```
docker-compose build explorer
```

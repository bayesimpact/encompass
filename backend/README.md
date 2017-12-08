# Backend Description
The backend API is served by Flask through Nginx and uWSGI.

## Backend endpoints

The backend API has the following endpoints and methods:

| Endpoint                  |      Method  |  Options |
|-------------------------- |:------------:|:------|
| /available-service-areas|  GET         |  |
| /api/providers     |  POST            | body: providers=[{"provider_address"}] |
| /api/representative_points     |  POST            | body: representative_points=[{rep_point_ids}] |
| /api/adequacies     |  POST            | body: {providers=[{provider_ids}], representative_points=[{rep_point_ids}]} |

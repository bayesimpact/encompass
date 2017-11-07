let fetch = require('fetch-mock')

fetch.post(/\/api\/adequacies\//, require('./mockResponses/adequacies'))

fetch.post(/\/api\/providers\//, [])

fetch.post(/\/api\/representative_points\//, [])
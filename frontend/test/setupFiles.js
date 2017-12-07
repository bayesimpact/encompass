let fetch = require('fetch-mock')

fetch.post(/\/api\/adequacies\//, require('./mockResponses/adequacies'))

fetch.post(/\/api\/providers\//, [])

fetch.post(/\/api\/representative_points\//, [])

global.Headers = Map

// Mock `requestAnimationFrame` (required for React tests)
global.requestAnimationFrame = callback =>
  setTimeout(callback, 0)

// Mock `URL.createObjectURL` (required for Mapbox tests)
global.URL.createObjectURL = () => ({})

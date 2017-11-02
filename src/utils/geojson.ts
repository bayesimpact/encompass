import { Adequacies, Provider, RepresentativePoint } from '../constants/datatypes'

/** TODO: Memoize */
export let providersToGeoJSON = toGeoJSON(providerToFeature)

/** TODO: Memoize */
export let representativePointsToGeoJSON = (adequacies: Adequacies) =>
  toGeoJSON(representativePointToFeature(adequacies))

function toGeoJSON<T>(f: (point: T) => GeoJSON.Feature<GeoJSON.GeometryObject>) {
  return (points: T[]): GeoJSON.FeatureCollection<GeoJSON.GeometryObject> => ({
    type: 'FeatureCollection',
    features: points.map(f)
  })
}

function providerToFeature(
  point: Provider
): GeoJSON.Feature<GeoJSON.GeometryObject> {
  return {
    id: point.id,
    type: 'Feature',
    properties: {
      address: point.address,
      languages: point.languages,
      npi: point.npi,
      specialty: point.specialty
    },
    geometry: {
      type: 'Point',
      coordinates: [point.lng, point.lat]
    }
  }
}

export function representativePointToFeature(adequacies: Adequacies) {
  return (point: RepresentativePoint): GeoJSON.Feature<GeoJSON.GeometryObject> => ({
    id: point.id,
    type: 'Feature',
    properties: {
      isAdequate: colorAdequacy(adequacies, point.id),
      population: point.population,
      service_area_id: point.serviceAreaId
    },
    geometry: {
      type: 'Point',
      coordinates: [point.lng, point.lat]
    }
  })
}

/**
 * Mapbox `stops` feature requires that all stops be of the same type.
 * For example, `true` and `false` are both booleans, but `undefined`
 * is not. We convert booleans and `undefined` to strings so their
 * types are the same when we pass them to Mapbox.
 */
function colorAdequacy(adequacies: Adequacies, pointId: number) {
  if (!(pointId in adequacies)) {
    return 'undefined'
  }
  switch (adequacies[pointId].isAdequate) {
    case true: return 'true'
    case false: return 'false'
  }
}

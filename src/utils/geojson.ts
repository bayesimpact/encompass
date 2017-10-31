import { Provider, RepresentativePoint } from '../constants/datatypes'

/** TODO: Memoize */
export let providersToGeoJSON = toGeoJSON(providerToFeature)

/** TODO: Memoize */
export let representativePointsToGeoJSON = toGeoJSON(representativePointToFeature)

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

export function representativePointToFeature(
  point: RepresentativePoint
): GeoJSON.Feature<GeoJSON.GeometryObject> {
  return {
    id: point.id,
    type: 'Feature',
    properties: {
      population: point.population,
      service_area_id: point.service_area_id
    },
    geometry: {
      type: 'Point',
      coordinates: [point.lng, point.lat]
    }
  }
}

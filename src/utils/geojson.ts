import * as extent from 'esri-extent'
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

/**
 * Expose name info.
 */
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
      county: point.county,
      isAdequate: colorAdequacy(adequacies, point.id),
      population: point.population,
      service_area_id: point.serviceAreaId,
      zip: point.zip
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

/**
 * Computes a bounding box for the given representative points.
 */
export function boundingBox(points: RepresentativePoint[]) {

  if (!points.length) {
    return null
  }

  let { xmin, ymin, xmax, ymax } = extent({
    type: 'FeatureCollection',
    features: points.map(_ => ({
      id: _.id,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [_.lng, _.lat]
      }
    }))
  })

  return {
    sw: { lat: ymin, lng: xmin },
    ne: { lat: ymax, lng: xmax }
  }
}

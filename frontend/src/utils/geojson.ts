import * as extent from 'esri-extent'
import { Adequacies, GeocodedProvider, RepresentativePoint } from '../constants/datatypes'

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
  point: GeocodedProvider
): GeoJSON.Feature<GeoJSON.GeometryObject> {
  return {
    type: 'Feature',
    properties: {
      address: point.address,
      languages: point.languages,
      npi: point.npi,
      name: point.name,
      specialty: point.specialty,
      center_type: point.center_type
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
      adequacyMode: adequacyToString(adequacies, point.id),
      population: Math.round(point.population),
      demographics: JSON.stringify(point.demographics, null, '\t'),
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
 * For example, `AdequacyMode.ADEQUATE` is a string, but `undefined`
 * is not. We convert `undefined` to a string so colors all have the
 * same type when we pass them to Mapbox.
 */
function adequacyToString(adequacies: Adequacies, pointId: number) {
  if (!(pointId in adequacies)) {
    return 'undefined'
  }
  return adequacies[pointId].adequacyMode
}

/**
 * Computes a bounding box for the given representative points.
 */
export function boundingBox(points: RepresentativePoint[]) {

  if (!points.length) {
    return null
  }

  let { xmin, ymin, xmax, ymax } = extent(points.map(_ => ({
    id: _.id,
    properties: {},
    type: 'Feature' as 'Feature',
    geometry: {
      type: 'Point' as 'Point',
      coordinates: [_.lng, _.lat]
    }
  })))

  return {
    sw: { lat: ymin, lng: xmin },
    ne: { lat: ymax, lng: xmax }
  }
}

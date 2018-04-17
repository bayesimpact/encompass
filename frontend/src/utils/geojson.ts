import * as extent from 'esri-extent'
import { pickBy } from 'lodash'
import { Adequacies, GeocodedProvider, Method, RepresentativePoint } from '../constants/datatypes'
import { formatGMapsCoordinates, formatGMapsDirection } from '../utils/formatters'

/** TODO: Memoize */
export let providersToGeoJSON = toGeoJSON(providerToFeature)

/** TODO: Memoize */
export let representativePointsToGeoJSON = (adequacies: Adequacies, method: Method) =>
  toGeoJSON(representativePointToFeature(adequacies, method))

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
): GeoJSON.Feature<GeoJSON.Point> {
  point['location'] = formatGMapsCoordinates(point.lat, point.lng)
  return {
    type: 'Feature',
    properties: pickBy(point), // Delete empty properties.
    geometry: {
      type: 'Point',
      coordinates: [point.lng, point.lat]
    }
  }
}

export function representativePointToFeature(adequacies: Adequacies, method: Method) {
  return (point: RepresentativePoint): GeoJSON.Feature<GeoJSON.Point> => ({
    id: point.id,
    type: 'Feature',
    properties: {
      county: point.county,
      population: Math.round(point.population),
      location: formatGMapsCoordinates(point.lat, point.lng),
      adequacyMode: adequacyModeToString(adequacies, point.id),
      closestProvider: toClosestProviderToString(adequacies, method, point.id),
      routeToProvider: toClosestProviderDirection(adequacies, point.id, point.lat, point.lng)
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
function adequacyModeToString(adequacies: Adequacies, pointId: number) {
  if (!(pointId in adequacies) || !adequacies[pointId].adequacyMode) {
    return 'undefined'
  }
  return adequacies[pointId].adequacyMode
}

function toClosestProviderToString(adequacies: Adequacies, method: Method, pointId: number) {
  if (!(pointId in adequacies)) {
    return 'undefined'
  }
  switch (method) {
    case 'straight_line':
      return Math.round((adequacies[pointId].toClosestProvider / 1609.34)).toString() + ' miles'
    case 'driving_time':
      return Math.round(adequacies[pointId].toClosestProvider).toString() + ' minutes'
  }
}

function toClosestProviderDirection(adequacies: Adequacies, pointId: number, pointLat: number, pointLng: number) {
  if (!(pointId in adequacies)) {
    return 'undefined'
  }
  return formatGMapsDirection(pointLat, pointLng, adequacies[pointId].closestProvider.lat, adequacies[pointId].closestProvider.lng)
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

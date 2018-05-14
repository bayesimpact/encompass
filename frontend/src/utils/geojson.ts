import * as extent from 'esri-extent'
import { pickBy } from 'lodash'
import { CONFIG } from '../config/config'
import { CENSUS_MAPPING } from '../constants/census'
import { Adequacies, GeocodedProvider, Method, RepresentativePoint } from '../constants/datatypes'
import { formatGMapsCoordinates, formatGMapsDirection } from '../utils/formatters'

/** TODO: Memoize */
export let providersToGeoJSON = toGeoJSON(providerToFeature)

/** TODO: Memoize */
export let representativePointsToGeoJSON = (adequacies: Adequacies, method: Method, censusCategory: string, censusGroup: string) =>
  toGeoJSON(representativePointToFeature(adequacies, method, censusCategory, censusGroup))

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

export function representativePointToFeature(adequacies: Adequacies, method: Method, censusCategory: string, censusGroup: string) {
  return (point: RepresentativePoint): GeoJSON.Feature<GeoJSON.Point> => ({
    id: point.id,
    type: 'Feature',
    properties: {
      county: point.county,
      population: getCensusGroupPopulation(point, censusCategory, censusGroup),
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

function getCensusGroupPopulation(point: RepresentativePoint, censusCategory: string, censusGroup: string) {
  if (!CENSUS_MAPPING[censusCategory].includes(censusGroup)) {
    return point.population
  }
  return point.population / 100 * (point.demographics[censusCategory][censusGroup] || 0)
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
      if (adequacies[pointId].toClosestProvider === CONFIG.absurdly_large_placeholder_time) {
        return 'Unknown'
      }
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

  /**
   * FIXME - Less hacky handling of -180 and 0 degree spanning boundaries.
   * Handle weird zoom behavior for Alaska and boundaries crossing the antemeridian.
  */
  if (xmin < -150 && xmax > 0) {
    xmax = -140
  }

  return {
    sw: { lat: ymin, lng: xmin },
    ne: { lat: ymax, lng: xmax }
  }
}

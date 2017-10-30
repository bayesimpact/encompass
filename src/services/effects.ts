import { Store } from 'babydux'
import { keyBy } from 'lodash'
import { Observable } from 'rx'
import { getRepresentativePoints, HydratedProvider, postProviders, RepresentativePoint } from './api'
import { Actions } from './store'

export function withEffects(store: Store<Actions>) {

  /**
   * Update representative points when distribution or serviceAreas change
   */
  Observable
    .combineLatest(
    store.on('distribution').startWith(store.get('distribution')),
    store.on('serviceAreas').startWith(store.get('serviceAreas'))
    )
    .subscribe(async ([distribution, serviceAreas]) => {
      let points = await getRepresentativePoints(distribution, serviceAreas)
      store.set('representativePoints')(toGeoJSON(representativePointToFeature)(points))
    })

  /**
   * Geocode providers when uploadedProviders changes
   */
  store.on('uploadedProviders').subscribe(async providers => {
    let result = await postProviders(providers)
    let hash = keyBy(providers, 'address')
    store.set('providers')(toGeoJSON(providerToFeature)(result.successes.map(_ => ({
      ...hash[_.address],
      ..._
    }))))
  })

  return store
}

function toGeoJSON<T>(f: (point: T) => GeoJSON.Feature<GeoJSON.GeometryObject>) {
  return (points: T[]): GeoJSON.FeatureCollection<GeoJSON.GeometryObject> => ({
    type: 'FeatureCollection',
    features: points.map(f)
  })
}

function providerToFeature(
  point: HydratedProvider
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

function representativePointToFeature(
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

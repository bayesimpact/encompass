import { Store } from 'babydux'
import { Observable } from 'rx'
import { getRepresentativePoints, RepresentativePoint } from './api'
import { Actions } from './store'

export function withEffects(store: Store<Actions>) {

  /**
   * Update representative points when distribution or serviceAreas change
   */
  Observable
    .merge(store.on('distribution') as any, store.on('serviceAreas'))
    .subscribe(async () => {
      let distribution = store.get('distribution') // TODO: get from arguments
      let serviceAreas = store.get('serviceAreas') // TODO: get from arguments
      let points = await getRepresentativePoints(distribution, serviceAreas)
      store.set('representativePoints')(toGeoJSON(points))
    })

  return store
}

function toGeoJSON(representativePoints: RepresentativePoint[]): GeoJSON.FeatureCollection<GeoJSON.GeometryObject> {
  return {
    type: 'FeatureCollection',
    features: representativePoints.map(pointToFeature)
  }
}

function pointToFeature(point: RepresentativePoint): GeoJSON.Feature<GeoJSON.GeometryObject> {
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

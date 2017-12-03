import { chain } from 'lodash'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import { Observable } from 'rx'
import { Measure, Standard } from '../constants/datatypes'
import { TIME_DISTANCES } from '../constants/timeDistances'
import { representativePointsFromServiceAreas } from '../utils/data'
import { boundingBox } from '../utils/geojson'
import { getAdequacies, getRepresentativePoints, isWriteProvidersSuccessResponse, postProviders, WriteProvidersRequest, WriteProvidersResponse, WriteProvidersSuccessResponse } from './api'
import { Store } from './store'

export function withEffects(store: Store) {

  /**
   * Update representative points when distribution or serviceAreas change
   */
  Observable
    .combineLatest(
    store.on('distribution').startWith(store.get('distribution')),
    store.on('serviceAreas').startWith(store.get('serviceAreas'))
    )
    .subscribe(async ([distribution, serviceAreas]) => {
      let points = await getRepresentativePoints(serviceAreas)

      // JavaScript doesn't preserve zero points for numbers. Because
      // `population` keys are strings in ("0.5", "2.5", "5.0"), when
      // `distribution` is 5 we need to manually convert it to the string
      // "5.0" so that we can check it against its corresponding key.
      let _distribution = distribution.toFixed(1)

      // Backend returns representative points for all distances at once.
      // Frontend then plucks out the points it needs, duck-typing on whether or
      // not the given point's `population` object has the current distance
      // defined as a key on it.
      store.set('representativePoints')(
        chain(points)
          .filter(_ => _distribution in _.population)
          .map(_ => ({
            ..._,
            population: (_.population as any)[_distribution]!, // TODO: Avoid any
            serviceAreaId: _.service_area_id
          }))
          .value()
      )
    })

  /**
   * When representative points change, auto-center and auto-zoom to a bounding
   * box containing all representative points.
   *
   * When the user selects a service area in the Analysis drawer, auto-center
   * and auto-zoom to a bounding box containing that service area.
   *
   * TODO: Replace this imperative bounds-setting with a declarative approach:
   *    1. Replace `store.mapCenter` and `store.mapZoom` with `store.mapBounds`
   *    2. Delete `store.map`
   */
  Observable.combineLatest(
    store.on('representativePoints').startWith(store.get('representativePoints')),
    store.on('selectedServiceArea').startWith(store.get('selectedServiceArea'))
  ).debounce(0).subscribe(([representativePoints, selectedServiceArea]) => {

    // TODO: Use an Option for clarity
    let map = store.get('map')
    if (!map) {
      return
    }
    let bounds = selectedServiceArea
      ? boundingBox(representativePointsFromServiceAreas([selectedServiceArea], store).value())
      : boundingBox(representativePoints)
    if (!bounds) {
      return
    }
    map.fitBounds(new LngLatBounds(
      new LngLat(bounds.sw.lng, bounds.sw.lat),
      new LngLat(bounds.ne.lng, bounds.ne.lat)
    ))
  })

  /**
   * Geocode providers when uploadedProviders changes
   *
   * TODO: Expose errors to user
   */
  store.on('uploadedProviders').subscribe(async providers => {
    let result = await postProviders(providers)
    store.set('providers')(
      chain(result)
        .zip<WriteProvidersResponse | WriteProvidersRequest>(providers)
        .partition(([res]: [WriteProvidersResponse]) => isWriteProvidersSuccessResponse(res))
        .tap(([successes, errors]) => {
          if (errors.length > 0) {
            store.set('error')(`Failed to geocode ${errors.length} (out of ${errors.length + successes.length}) providers`)
          } else if (successes.length > 0) {
            store.set('success')(`All ${successes.length} providers geocoded`)
          }
        }
        )
        .first()
        .map(([res, req]: [WriteProvidersSuccessResponse, WriteProvidersRequest]) => ({
          ...req,
          lat: res.lat,
          lng: res.lng,
          id: res.id
        }))
        .value()
    )
  })

  /**
   * Fetch adequacies when providers, representative points, measure, or standards change
   */
  Observable
    .combineLatest(
    store.on('providers'),
    store.on('representativePoints'),
    store.on('measure').startWith(store.get('measure')),
    store.on('standard').startWith(store.get('standard'))
    )
    .subscribe(async ([providers, representativePoints, measure, standard]) => {
      // TODO: Fix errors when providers and representative points are empty strings and remove this.
      if (providers.length && representativePoints.length) {
        let adequacies = await getAdequacies(providers.map(_ => _.id), store.get('serviceAreas'))
        store.set('adequacies')(
          chain(representativePoints.map(_ => _.id))
            .zipObject(adequacies)
            .mapValues(_ => ({
              isAdequate: isAdequate(
                _.distance_to_closest_provider,
                _.time_to_closest_provider,
                measure,
                standard
              ),
              id: _.id,
              distanceToClosestProvider: _.distance_to_closest_provider,
              timeToClosestProvider: _.time_to_closest_provider,
              closestProviderByDistance: _.closest_provider_by_distance,
              closestProviderByTime: _.closest_provider_by_time
            }))
            .value()
        )
      }
    })

  /**
   * If the user selects a service area, then deselects that service area's
   * zip code or county in the Service Area drawer, we should de-select the
   * service area too.
   */
  store.on('serviceAreas').subscribe(serviceAreas => {
    let selectedServiceArea = store.get('selectedServiceArea')
    if (selectedServiceArea && !serviceAreas.includes(selectedServiceArea)) {
      store.set('selectedServiceArea')(null)
    }
  })

  return store
}

function isAdequate(
  distance: number,
  time: number,
  measure: Measure,
  standard: Standard
) {
  switch (standard) {
    case 'distance':
      return distance < measure
    case 'time_distance':
      return distance < measure && time < TIME_DISTANCES.get(measure)!
    case 'time':
      return time < TIME_DISTANCES.get(measure)!
  }
}

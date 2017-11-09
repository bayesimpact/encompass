import { Store } from 'babydux'
import { chain, keyBy } from 'lodash'
import { Observable } from 'rx'
import { Measure, RepresentativePoint, Standard } from '../constants/datatypes'
import { TIME_DISTANCES } from '../constants/timeDistances'
import { getAdequacies, getRepresentativePoints, isWriteProvidersSuccessResponse, postProviders, ReadAdequaciesResponse, WriteProvidersErrorResponse, WriteProvidersRequest, WriteProvidersResponse, WriteProvidersSuccessResponse } from './api'
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
      let points = await getRepresentativePoints(serviceAreas)

      // Backend returns representative points for all distances at once.
      // Frontend then plucks out the points it needs, duck-typing on whether or
      // not the given point's `population` object has the current distance
      // defined as a key on it.
      store.set('representativePoints')(
        chain(points)
          .filter(_ => distribution in _.population)
          .map(_ => ({
            ..._,
            population: _.population[distribution]!,
            serviceAreaId: _.service_area_id
          }))
          .value()
      )
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
        .tap(([successes, errors]) =>
          store.set('error')(`Failed to geocode ${errors.length} (of ${errors.length + successes.length}) providers`)
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
   * Fetch adequacies when providers, representative points, measure, or standard change
   */
  Observable
    .combineLatest(
    store.on('providers'),
    store.on('representativePoints'),
    store.on('measure').startWith(store.get('measure')),
    store.on('standard').startWith(store.get('standard'))
    )
    .subscribe(async ([providers, representativePoints, measure, standard]) => {
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

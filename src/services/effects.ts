import { Store } from 'babydux'
import { chain } from 'lodash'
import { Observable } from 'rx'
import { Measure, Standard } from '../constants/datatypes'
import { TIME_DISTANCES } from '../constants/timeDistances'
import { getAdequacies, getRepresentativePoints, isWriteProvidersSuccessResponse, postProviders, WriteProvidersRequest, WriteProvidersResponse, WriteProvidersSuccessResponse } from './api'
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
   * When service areas change, auto-center and auto-zoom to a bounding
   * box containing all service areas.
   */
  store.on('serviceAreas').subscribe(() =>
    store.set('shouldAutoAdjustMap')(true)
  )

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
          } else {
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
   * Set uncomputed when providers, representative points, measure, or standard change
   */
  Observable
    .combineLatest(
    store.on('providers'),
    store.on('representativePoints'),
    store.on('measure').startWith(store.get('measure')),
    store.on('standard').startWith(store.get('standard'))
    )
    .subscribe(async ([providers, representativePoints, measure, standard]) => {
      store.set('adequaciesComputed')(false)
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


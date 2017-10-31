import { Store } from 'babydux'
import { chain, keyBy } from 'lodash'
import { Observable } from 'rx'
import { Provider, RepresentativePoint } from '../constants/datatypes'
import { getAdequacies, getRepresentativePoints, isWriteProvidersSuccessResponse, postProviders, ReadRepresentativePointsResponse, WriteProvidersErrorResponse, WriteProvidersRequest, WriteProvidersResponse, WriteProvidersSuccessResponse } from './api'
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

      // Backend return representative points for all distances at once.
      // Frontend then plucks out the points it needs, duck-typing on whether or
      // not the given point's `population` object has the current distance
      // defined as a key on it.
      store.set('representativePoints')(
        chain(points)
          .filter(_ => distribution in _.population)
          .map(_ => ({
            ..._,
            population: _.population[distribution]!
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
        .tap(([_, errors]) => console.log('POST /api/provider errors:', errors))
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
   * Fetch adequacies when providers or service areas change
   */
  Observable
    .combineLatest(
    store.on('providers'),
    store.on('serviceAreas')
    )
    .subscribe(async ([providers, serviceAreas]) => {
      let adequacies = await getAdequacies(providers.map(_ => _.id), serviceAreas)
      console.log('adequacies', adequacies)
    })

  return store
}

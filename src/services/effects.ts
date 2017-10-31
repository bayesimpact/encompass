import { Store } from 'babydux'
import { chain, keyBy } from 'lodash'
import { Observable } from 'rx'
import { Provider, RepresentativePoint } from '../constants/datatypes'
import { getRepresentativePoints, isWriteProvidersSuccessResponse, postProviders, WriteProvidersErrorResponse, WriteProvidersRequest, WriteProvidersResponse, WriteProvidersSuccessResponse } from './api'
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
      store.set('representativePoints')(points)
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

  return store
}

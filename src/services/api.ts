import { memoize } from 'lodash'
import { RepresentativePoint } from '../constants/datatypes'

const API_ROOT = 'http://localhost:8080'

let request = (method: 'GET' | 'POST') =>
  (url: string) =>
    <T>(body: object) =>
      fetch(new Request(API_ROOT + url, {
        body: JSON.stringify(body),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method
      })).then<T>(_ => _.json())

let POST = request('POST')

//
// POST /api/providers
//

export type WriteProvidersRequest = {
  address: string
  /** Eg. "Burmese", "Chinese", "Spanish", etc.  */
  languages: string[]
  /** Unique 10-digit gov't ID assigned to each healthcare provider. */
  npi: number
  /** Eg. "Internal Medicine", "Obstetrics/Gynecology", etc. */
  specialty: string
}

export type WriteProvidersResponse = WriteProvidersSuccessResponse | WriteProvidersErrorResponse

export type WriteProvidersSuccessResponse = {
  status: 'success'
  id: number
  lat: number
  lng: number
}

export type WriteProvidersErrorResponse = {
  status: 'error'
  message: string
}

export function isWriteProvidersSuccessResponse(
  response: WriteProvidersSuccessResponse | WriteProvidersErrorResponse
): response is WriteProvidersSuccessResponse {
  return response.status === 'success'
}

export let postProviders = (providers: WriteProvidersRequest[]) =>
  POST('/api/providers')<WriteProvidersResponse[]>(providers)

//
// POST /api/representative_points
//

type ReadRepresentativePointsResponse = RepresentativePoint[]

export let getRepresentativePoints = memoize(
  (distribution: number, serviceAreaIds: string[]) =>
    POST('/api/representative_points')<ReadRepresentativePointsResponse>({
      distribution,
      service_area_ids: serviceAreaIds
    }),
  (distribution: number, serviceAreaIds: string[]) => `${distribution}-${serviceAreaIds.join(',')}`
)

//
// POST /api/adequacies
//

type ReadAdequaciesResponse = {
  id: number
  distance_to_closest_provider: number
  time_to_closest_provider: number
  closest_provider_by_distance: number
  closest_provider_by_time: number
}

export let getAdequacies = memoize(
  (providersIds: number[], serviceAreaIds: string[]) =>
    POST('/api/adequacies')<ReadAdequaciesResponse>({ providersIds, serviceAreaIds }),
  (providersIds: number[], serviceAreaIds: string[]) => `${providersIds.join(',')}-${serviceAreaIds.join(',')}`
)

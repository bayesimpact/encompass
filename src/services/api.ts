import { memoize } from 'lodash'

const API_ROOT = 'http://localhost:8080'

let request = (method: 'GET' | 'POST') =>
  (url: string) =>
    <T>(body: object) => {

      // Set JSON headers
      let headers = new Headers
      headers.set('Accept', 'application/json, text/plain, */*')
      headers.set('Content-Type', 'application/json')

      // Send request
      return fetch(API_ROOT + url, {
        body: JSON.stringify(body),
        headers,
        method
      }).then<T>(_ => _.json())
    }

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
  POST('/api/providers/')<WriteProvidersResponse[]>({ providers })

//
// POST /api/representative_points
//

type ReadRepresentativePointsResponse = {
  county: string
  id: number
  lat: number
  lng: number
  population: {
    0.5?: number,
    2.5?: number
    5: number
  }
  service_area_id: string
  zip: string
}[]

export let getRepresentativePoints = memoize(
  (serviceAreaIds: string[]) =>
    POST('/api/representative_points/')<ReadRepresentativePointsResponse>({
      service_area_ids: serviceAreaIds
    }),
  (serviceAreaIds: string[]) => serviceAreaIds.join(',')
)

//
// POST /api/adequacies
//

export type ReadAdequaciesResponse = {
  id: number
  distance_to_closest_provider: number
  time_to_closest_provider: number
  closest_provider_by_distance: number
  closest_provider_by_time: number
}

export let getAdequacies = memoize(
  (providersIds: number[], serviceAreaIds: string[]) =>
    POST('/api/adequacies/')<ReadAdequaciesResponse[]>({
      provider_ids: providersIds,
      service_area_ids: serviceAreaIds
    }),
  (providersIds: number[], serviceAreaIds: string[]) => `${providersIds.join(',')}-${serviceAreaIds.join(',')}`
)

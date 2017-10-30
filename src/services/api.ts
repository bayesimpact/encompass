import { memoize } from 'lodash'

const API_ROOT = 'https://localhost:9001'

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

export type WriteProvidersRequest = {
  address: string
  /** Eg. "Burmese", "Chinese", "Spanish", etc.  */
  languages: string[]
  /** Unique 10-digit gov't ID assigned to each healthcare provider. */
  npi: number
  /** Eg. "Internal Medicine", "Obstetrics/Gynecology", etc. */
  specialty: string
}

// TODO: Move this somewhere else
export type HydratedProvider = WriteProvidersRequest & {
  id: number
  lat: number
  lng: number
}

type WriteProvidersResponse = {
  successes: {
    address: string
    id: number
    lat: number
    lng: number
  }[]
  errors: {
    address: string
    message: string
  }[]
}

export type RepresentativePoint = {
  id: number
  lat: number
  lng: number
  population: number
  service_area_id: number
}

type ReadRepresentativePointsResponse = RepresentativePoint[]

type ReadAdequaciesResponse = {
  id: number
  distance_to_closest_provider: number
  time_to_closest_provider: number
  closest_provider_by_distance: number
  closest_provider_by_time: number
}

export let postProviders = (providers: WriteProvidersRequest[]) =>
  POST('/api/providers')<WriteProvidersResponse>(providers)

export let getRepresentativePoints = memoize(
  (distribution: number, serviceAreaIds: string[]) =>
    POST('/api/representative_points')<ReadRepresentativePointsResponse>({ distribution, serviceAreaIds }),
  (distribution: number, serviceAreaIds: string[]) => `${distribution}-${serviceAreaIds.join(',')}`
)

export let getAdequacies = memoize(
  (providersIds: number[], serviceAreaIds: string[]) =>
    POST('/api/adequacies')<ReadAdequaciesResponse>({ providersIds, serviceAreaIds }),
  (providersIds: number[], serviceAreaIds: string[]) => `${providersIds.join(',')}-${serviceAreaIds.join(',')}`
)

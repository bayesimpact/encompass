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

type POSTProvidersResponse = (
  { status: 1, id: number, lat: number, lng: number }
  | { status: 2 }
)[]

export type RepresentativePoint = {
  id: number
  lat: number
  lng: number
  population: number
  service_area_id: number
}

type GETRepresentativePointsResponse = RepresentativePoint[]

type GETAdequaciesResponse = {
  id: number
  distance_to_closest_provider: number
  time_to_closest_provider: number
  closest_provider_by_distance: number
  closest_provider_by_time: number
}

export let postProviders = (providers: { address: string, type: number }[]) =>
  POST('/api/providers')<POSTProvidersResponse>(providers)

export let getRepresentativePoints = memoize(
  (distribution: number, serviceAreaIds: string[]) =>
    POST('/api/representative_points')<GETRepresentativePointsResponse>({ distribution, serviceAreaIds }),
  (distribution: number, serviceAreaIds: string[]) => `${distribution}-${serviceAreaIds.join(',')}`
)

export let getAdequacies = memoize(
  (providersIds: number[], serviceAreaIds: string[]) =>
    POST('/api/adequacies')<GETAdequaciesResponse>({ providersIds, serviceAreaIds }),
  (providersIds: number[], serviceAreaIds: string[]) => `${providersIds.join(',')}-${serviceAreaIds.join(',')}`
)

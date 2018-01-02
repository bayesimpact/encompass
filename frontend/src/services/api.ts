import { memoize } from 'lodash'
import { PostAdequaciesRequest } from '../constants/api/adequacies-request'
import { PostAdequaciesResponse } from '../constants/api/adequacies-response'
import { PostProvidersRequest } from '../constants/api/providers-request'
import { Error, PostProvidersResponse, Success } from '../constants/api/providers-response'
import { PostRepresentativePointsRequest } from '../constants/api/representative-points-request'
import { PostRepresentativePointsResponse } from '../constants/api/representative-points-response'

const { API_ROOT } = process.env

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

export function isWriteProvidersSuccessResponse(
  response: Success | Error
): response is Success {
  return response.status === 'success'
}

export let postProviders = (params: PostProvidersRequest) =>
  POST('/api/providers/')<PostProvidersResponse>(params)

//
// POST /api/representative_points
//

export let getRepresentativePoints = memoize(
  (params: PostRepresentativePointsRequest) =>
    POST('/api/representative_points/')<PostRepresentativePointsResponse>(params),
  (params: PostRepresentativePointsRequest) => params.service_area_ids.join(',')
)

//
// POST /api/adequacies
//

export let getAdequacies = memoize(
  (params: PostAdequaciesRequest) => POST('/api/adequacies/')<PostAdequaciesResponse>(params),
  (params: PostAdequaciesRequest) => `${params.providers.join(',')}-${params.service_area_ids.join(',')}`
)

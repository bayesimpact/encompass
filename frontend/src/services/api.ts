import { kebabCase, memoize } from 'lodash'
import { CONFIG } from '../config/config'
import { PostAdequaciesRequest } from '../constants/api/adequacies-request'
import { PostAdequaciesResponse } from '../constants/api/adequacies-response'
import { PostCensusDataResponse } from '../constants/api/census-data-response'
import { PostGeocodeRequest } from '../constants/api/geocode-request'
import { Error as GeocodeError, PostGeocodeResponse, Success } from '../constants/api/geocode-response'
import { PostRepresentativePointsRequest } from '../constants/api/representative-points-request'
import { PostRepresentativePointsResponse } from '../constants/api/representative-points-response'
import { Dataset, Method } from '../constants/datatypes'
import { safeDatasetHint } from '../utils/formatters'

const API_ROOT = CONFIG.api.backend_root

let request = (method: 'GET' | 'POST') =>
  (url: string) =>
    <T>(body: object) => {

      // Set JSON headers
      let headers = new Headers()
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
// POST /api/geocode
//

export function isPostGeocodeSuccessResponse(
  response: Success | GeocodeError
): response is Success {
  return response.status === 'success'
}

export let postGeocode = (params: PostGeocodeRequest) =>
  POST('/api/geocode/')<PostGeocodeResponse>(params)

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
  (params: PostAdequaciesRequest) => `${params.method}-${params.providers.join(',')}-${params.service_area_ids.join(',')}`
)

export async function getStaticRPs(selectedDataset: Dataset | null) {
  const res = await fetch(getStaticRPUrl(selectedDataset))
  const body = await res.json()
  return body as PostRepresentativePointsResponse
}

export async function getStaticAdequacies(selectedDataset: Dataset | null, method: Method) {
  const res = await fetch(getStaticAdequacyUrl(selectedDataset, method))
  const body = await res.json()
  return body as PostAdequaciesResponse
}

export async function getStaticDemographics(selectedDataset: Dataset | null) {
  const res = await fetch(getStaticDemographicsUrl(selectedDataset))
  const body = await res.json()
  return body as PostCensusDataResponse
}

function getStaticDatasetString(selectedDataset: Dataset | null): string {
  if (!selectedDataset) {
    throw new Error('No dataset selected.')
  }
  return safeDatasetHint(selectedDataset)
}

export function getStaticRPUrl(selectedDataset: Dataset | null): string {
  const rootUrl = CONFIG.staticAssets.rootUrl
  const path = CONFIG.staticAssets.representativePoints.path
  const datasetString = getStaticDatasetString(selectedDataset)
  return `${rootUrl}${path}${datasetString}.json`
}

export function getStaticAdequacyUrl(selectedDataset: Dataset | null, method: Method): string {
  const rootUrl = CONFIG.staticAssets.rootUrl
  const path = CONFIG.staticAssets.adequacies.path
  const datasetString = getStaticDatasetString(selectedDataset)
  const methodString = kebabCase(method.toString())
  return `${rootUrl}${path}${datasetString}-${methodString}.json`
}

export function getStaticDemographicsUrl(selectedDataset: Dataset | null) {
  const rootUrl = CONFIG.staticAssets.rootUrl
  const path = CONFIG.staticAssets.demographics.path
  const datasetString = getStaticDatasetString(selectedDataset)
  return `${rootUrl}${path}${datasetString}.json`
}

//
// POST /api/census-data-by-service-area/
//

export let getCensusData = memoize(
  (params: PostRepresentativePointsRequest) =>
    POST('/api/census-data-by-service-area/')<PostCensusDataResponse>(params),
  (params: PostRepresentativePointsRequest) => params.service_area_ids.join(',')
)

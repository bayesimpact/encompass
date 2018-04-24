/**
 * Codegens API typings
 */
import Axios from 'axios'
import 'isomorphic-fetch'
import { seq } from 'promise-seq'
import { CONFIG } from '../src/config/config'
import { DATASETS } from '../src/constants/datasets'
import { Method } from '../src/constants/datatypes'
import {
  getAdequacies, getCensusData, getRepresentativePoints
} from '../src/services/api'
import { safeDatasetHint } from '../src/utils/formatters'
const METHODS: Method[] = ['driving_time', 'straight_line']

main()

async function main() {

  console.info('Running cache build...')
  if (!CONFIG.cache.enabled) {
    throw Error('Caching is not activated in the config file.')
  }
  await testAPIAccess()
  console.info('[Step 1] Get representative points and census')
  await cacheRPCensus()

  console.info('[Step 2] Cache Adequacies')
  await cacheAdequacies()
}

async function testAPIAccess() {
  let r = await Axios.get('http://localhost:8080/api/available-service-areas/')
  if (r.status !== 200) {
    throw Error('GETting http://localhost:8080/api/available-service-areas/. Is the server running?')
  }
}

function cacheRPCensus() {
  return seq(...DATASETS.map(_ => async () => {
    console.log('  Getting RPs and Census for ' + safeDatasetHint(_))
    await getRepresentativePoints({ service_area_ids: _.serviceAreaIds })
    await getCensusData({ service_area_ids: _.serviceAreaIds })
  }))
}

function cacheAdequacies() {
  return seq(...DATASETS.map(dataset => async () =>
    seq(...METHODS.map(method => async () => {
      console.log('  Getting Adequacy for ' + safeDatasetHint(dataset) + ' for ' + method)
      return getAdequacies({
        method,
        providers: dataset.providers.map((_, n) => ({ latitude: _.lat, longitude: _.lng, id: n })),
        service_area_ids: dataset.serviceAreaIds,
        dataset_hint: safeDatasetHint(dataset)
      })
    }))
  ))
}

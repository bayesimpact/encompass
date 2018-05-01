/**
 * Codegens API typings
 */
import * as S3 from 'aws-sdk/clients/s3'
import Axios from 'axios'
import 'isomorphic-fetch'
import { seq } from 'promise-seq'
import { CONFIG } from '../src/config/config'
import { DATASETS } from '../src/constants/datasets'
import { Method } from '../src/constants/datatypes'
import {
  getAdequacies, getCensusData, getRepresentativePoints, getStaticAdequacyUrl, getStaticDemographicsUrl, getStaticRPUrl
} from '../src/services/api'
import { safeDatasetHint } from '../src/utils/formatters'

const METHODS: Method[] = ['driving_time', 'straight_line']

/**
* To push files to S3, you will need 'write' permissions for the bucket you are
* trying to push the files to. This script uses your default $AWS_PROFILE.
* WARNING - Please note that file with the same name will be overriden.
*/
const s3Bucket = 'encompass-public-data'
const s3 = new S3()
const uploadToS3 = true

main()

async function main() {

  console.info('Running cache build...')
  // If you would like to check that the backend is actually configured to
  // cache responses, you can use the two lines of code below.
  // However, we suggest checking the config manually and restart the backend.
  // Just to be safe...
  // if (!CONFIG.cache.enabled) {
  //   throw Error('Caching is not activated in the config file.')
  // }
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
    let representativePoints = await getRepresentativePoints({ service_area_ids: _.serviceAreaIds })
    let census = await getCensusData({ service_area_ids: _.serviceAreaIds })
    if (uploadToS3) {
      let rpParams = { Bucket: s3Bucket, Key: getS3Key(getStaticRPUrl(_)), Body: JSON.stringify(representativePoints), ContentType: 'application/json', ACL: 'public-read' }
      let censusParams = { Bucket: s3Bucket, Key: getS3Key(getStaticDemographicsUrl(_)), Body: JSON.stringify(census), ContentType: 'application/json', ACL: 'public-read' }
      s3.putObject(rpParams, s3Callback)
      s3.putObject(censusParams, s3Callback)
    }
  }))
}

function cacheAdequacies() {
  return seq(...DATASETS.map(dataset => async () =>
    seq(...METHODS.map(method => async () => {
      console.log('  Getting Adequacy for ' + safeDatasetHint(dataset) + ' for ' + method)
      let adequacies = await getAdequacies({
        method,
        providers: dataset.providers.map((_, n) => ({ latitude: _.lat, longitude: _.lng, id: n })),
        service_area_ids: dataset.serviceAreaIds,
        dataset_hint: safeDatasetHint(dataset)
      })
      if (uploadToS3 && adequacies) {
        let adequacyParams = { Bucket: s3Bucket, Key: getS3Key(getStaticAdequacyUrl(dataset, method)), Body: JSON.stringify(adequacies), ContentType: 'application/json', ACL: 'public-read' }
        s3.putObject(adequacyParams, s3Callback)
      }
    }))
  ))
}

function getS3Key(s3URL: string) {
  let s3Key = s3URL.replace(CONFIG.staticAssets.rootUrl, '')
  return s3Key
}

function s3Callback(err: any, data: any) { console.log(JSON.stringify(err) + ' ' + JSON.stringify(data)) }

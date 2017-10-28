import { capitalize, chain } from 'lodash'
import { Drawer } from 'material-ui'
import * as React from 'react'
import { SERVICE_AREAS_TO_ZIPS } from '../../constants/zipCodes'
import { store, withStore } from '../../services/store'
import { parseCSV } from '../../utils/csv'
import { capitalizeWords } from '../../utils/string'
import { CountySelector } from '../CountySelector/CountySelector'
import { CSVUploader } from '../CSVUploader/CSVUploader'
import { StateSelector } from '../StateSelector/StateSelector'

type State = {
  file?: File
}

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ServiceAreas = withStore('serviceAreasCounties', 'serviceAreasFilename')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Service Areas</h2>
    <CSVUploader onUpload={onFileSelected} />
    <p className='Ellipsis Muted SmallFont'>{
      store.get('serviceAreasFilename')
        ? `Uploaded ${store.get('serviceAreasFilename')}`
        : 'Upload valid zip codes and/or counties'
    }</p>

    <hr />

    <StateSelector />
  </Drawer >
)

async function onFileSelected(file: File) {
  let serviceAreas = await parseServiceAreasCSV(file)
  store.set('serviceAreas', serviceAreas)
  store.set('serviceAreasCounties', getCounties(serviceAreas))
  store.set('serviceAreasFilename', file.name)
}

function getCounties(serviceAreas: [string, number][]): string[] {
  return chain(serviceAreas)
    .map(_ => _[0])
    .uniq()
    .value()
}

/**
 * TODO: Fuzzy matching for column names
 * TODO: Expose parse, validation errors to user
 */
async function parseServiceAreasCSV(file: File): Promise<[string, number][]> {
  let csv = await parseCSV<string[]>(file)
  let countyIndex = csv[0].indexOf('CountyName')
  let zipIndex = csv[0].indexOf('ZipCode')

  // validate that CountyName and ZipCode columns are defined
  if (countyIndex < 0 || zipIndex < 0) {
    throw 'CSV must define columns "CountyName" and "ZipCode"'
  }

  return chain(csv)
    .slice(1)                       // ignore header row
    .filter(([_]) => _ !== '')      // ignore empty rows
    .map(_ => {

      let county = capitalizeWords(_[countyIndex])
      let zip = Number(_[zipIndex]) // in case zip code isn't a number already

      // validate that county exists
      if (!(county in SERVICE_AREAS_TO_ZIPS)) {
        throw `County "${county}" is not supported`
      }

      // validate that zip code is in county
      // TODO: consider pre-hashing zips for O(1) lookup
      if (!SERVICE_AREAS_TO_ZIPS[county].includes(zip)) {
        throw `Zip ${zip} does not exist in county "${county}"`
      }

      return [county, zip] as [string, number]
    })
    .value()
}

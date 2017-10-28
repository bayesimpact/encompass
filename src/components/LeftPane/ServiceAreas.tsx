import { capitalize, chain } from 'lodash'
import { Drawer } from 'material-ui'
import * as React from 'react'
import { COUNTIES_TO_ZIPS } from '../../constants/zipCodes'
import { store, withStore } from '../../services/store'
import { parseCSV } from '../../utils/csv'
import { capitalizeWords } from '../../utils/string'
import { CountySelector } from '../CountySelector/CountySelector'
import { CSVUploader } from '../CSVUploader/CSVUploader'
import { StateSelector } from '../StateSelector/StateSelector'
import { ZipCodeSelector } from '../ZipCodeSelector/ZipCodeSelector'

type State = {
  file?: File
}

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ServiceAreas = withStore(
  'counties',
  'serviceAreas',
  'uploadedServiceAreasFilename'
)(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Service Areas</h2>
    <CSVUploader onUpload={onFileSelected} />
    <p className='Ellipsis Muted SmallFont'>{
      store.get('uploadedServiceAreasFilename')
        ? `Uploaded ${store.get('uploadedServiceAreasFilename')}`
        : 'Upload valid zip codes and/or counties'
    }</p>

    <hr />

    <StateSelector />
    <CountySelector
      onChange={store.set('counties')}
      selectedCounties={store.get('counties')}
    />
    <ZipCodeSelector
      counties={store.get('counties')}
      onChange={store.set('serviceAreas')}
      selectedServiceAreas={store.get('serviceAreas')}
    />
  </Drawer >
  )

async function onFileSelected(file: File) {
  let serviceAreas = await parseServiceAreasCSV(file)
  store.set('counties')(getCounties(serviceAreas))
  store.set('uploadedServiceAreasFilename')(file.name)
}

function getCounties(serviceAreas: [string, string][]): string[] {
  return chain(serviceAreas)
    .map(_ => _[0])
    .uniq()
    .value()
}

/**
 * TODO: Fuzzy matching for column names
 * TODO: Expose parse, validation errors to user
 */
async function parseServiceAreasCSV(file: File): Promise<[string, string][]> {
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
      let zip = _[zipIndex]

      // validate that county exists
      if (!(county in COUNTIES_TO_ZIPS)) {
        throw `County "${county}" is not supported`
      }

      // validate that zip code is in county
      // TODO: consider pre-hashing zips for O(1) lookup
      if (!COUNTIES_TO_ZIPS[county].includes(zip)) {
        throw `Zip ${zip} does not exist in county "${county}"`
      }

      return [county, zip] as [string, string]
    })
    .value()
}

import { capitalize, chain } from 'lodash'
import { Drawer } from 'material-ui'
import * as React from 'react'
import { COUNTIES_TO_ZIPS } from '../../../../constants/zipCodes'
import { store, withStore } from '../../../../services/store'
import { parseCSV, parseRows } from '../../../../utils/csv'
import { capitalizeWords } from '../../../../utils/string'
import { CountySelector } from '../../../CountySelector/CountySelector'
import { CSVUploader } from '../../../CSVUploader/CSVUploader'
import { StateSelector } from '../../../StateSelector/StateSelector'
import { ZipCodeSelector } from '../../../ZipCodeSelector/ZipCodeSelector'

type State = {
  file?: File
}

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ServiceAreasDrawer = withStore(
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

const COLUMNS = [
  { aliases: ['CountyName'], required: true },
  { aliases: ['ZipCode'], required: true }
]

let parse = parseRows(COLUMNS, (([county, zip]) => {
  let _county = capitalizeWords(county!)

  // validate that county exists
  if (!(_county in COUNTIES_TO_ZIPS)) {
    throw `County "${county}" is not supported`
  }

  // validate that zip code is in county
  // TODO: consider pre-hashing zips for O(1) lookup
  if (!COUNTIES_TO_ZIPS[_county].includes(zip!)) {
    throw `Zip ${zip} does not exist in county "${county}"`
  }

  return [_county, zip] as [string, string]
}))

/**
 * TODO: Expose parse, validation errors to user
 */
async function parseServiceAreasCSV(file: File): Promise<[string, string][]> {
  let result = await parse(file)
  console.log(result)
  return result[1]
}

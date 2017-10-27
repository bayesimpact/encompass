import { Drawer } from 'material-ui'
import * as React from 'react'
import { store, withStore } from '../../services/store'
import { parseCSV } from '../../utils/csv'
import { CSVUploader } from '../CSVUploader/CSVUploader'

type State = {
  file?: File
}

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ServiceAreas = withStore('serviceAreasFilename')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Service Areas</h2>
    <CSVUploader onUpload={onFileSelected} />
    <p className='Ellipsis Muted SmallFont'>{
      store.get('serviceAreasFilename')
        ? `Uploaded ${store.get('serviceAreasFilename')}`
        : 'Upload valid zip codes and/or counties'
    }</p>
  </Drawer >
)

async function onFileSelected(file: File) {
  let serviceAreas = await parseServiceAreasCSV(file)
  store.set('serviceAreas', serviceAreas)
  store.set('serviceAreasFilename', file.name)
}

/**
 * TODO: Fuzzy matching for column names
 * TODO: Expose parse error to user
 * TODO: Verify that each zip code actually belongs to the given ServiceArea
 * TODO: Map ServiceAreas and ZipCodes to their corresponding IDs
 */
async function parseServiceAreasCSV(file: File): Promise<[string, number][]> {
  let csv = await parseCSV<string[]>(file)
  let countyIndex = csv[0].indexOf('CountyName')
  let zipIndex = csv[0].indexOf('ZipCode')
  if (countyIndex < 0 || zipIndex < 0) {
    throw 'CSV must define columns "CountyName" and "ZipCode"'
  }

  return csv
    .slice(1)                       // ignore header row
    .filter(([_]) => _ !== '')      // ignore empty rows
    .map(_ => [
      _[countyIndex],
      Number(_[zipIndex])           // in case zip code isn't a number already
    ] as [string, number])
}

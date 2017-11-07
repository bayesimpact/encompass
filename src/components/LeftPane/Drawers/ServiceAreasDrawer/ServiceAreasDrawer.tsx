import { chain, flatten, spread } from 'lodash'
import { Drawer } from 'material-ui'
import * as React from 'react'
import { COUNTIES_TO_ZIPS, countiesFromZip, serviceArea, zipsFromCounty } from '../../../../constants/zipCodes'
import { store, withStore } from '../../../../services/store'
import { ColumnDefinition, isEmpty, parseCSV, ParseError, parseRows } from '../../../../utils/csv'
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

/**
 * TODO: Expose parse, validation errors to user
 */
async function onFileSelected(file: File) {
  let [errors, serviceAreas] = await parseServiceAreasCSV(file)
  errors.forEach(console.error)
  store.set('counties')(getCounties(serviceAreas))
  store.set('serviceAreas')(serviceAreas.map(([county, zip]) => serviceArea(county, zip)))
  store.set('uploadedServiceAreasFilename')(file.name)
}

function getCounties(serviceAreas: [string, string][]): string[] {
  return chain(serviceAreas)
    .map(_ => _[0])
    .uniq()
    .value()
}

const COLUMNS = [
  { aliases: ['CountyName', 'county'] },
  { aliases: ['ZipCode', 'zip'] }
]

let parse = parseRows(COLUMNS, (([county, zip]): [string, string][] => {

  // We infer missing zips and counties, so one zip might map to
  // more than one county, and one county maps to many zips.
  let pairs = getCountyAndZip(county, zip)
    .map(([county, zip]) => [capitalizeWords(county), zip] as [string, string])

  // validate that counties exist
  pairs.forEach(([county]) => {
    if (!(county in COUNTIES_TO_ZIPS)) {
      throw `County "${county}" is not supported`
    }
  })

  // validate that zip code is in county
  // TODO: consider pre-hashing zips for O(1) lookup
  pairs.forEach(([county, zip]) => {
    if (!COUNTIES_TO_ZIPS[county].includes(zip)) {
      throw `Zip ${zip} does not exist in county "${county}"`
    }
  })

  return pairs
    .uniqBy(spread(serviceArea))
    .value()
}), validateHeaders)

function validateHeaders(columns: ColumnDefinition[], fields: string[]) {
  if (isEmpty(fields[0]) && isEmpty(fields[1])) {
    return [new ParseError(0, 0, columns[0], fields, `CSV must define columns "CountyName" and/or "ZipCode"`)]
  }
  return []
}

function getCountyAndZip(county: string | null, zip: string | null): Lazy<[string, string][]> {
  switch (getParseMode(county, zip)) {

    case ParseMode.INFER_COUNTY:
      // If county isn't defined but zip is, default to all counties
      // that contain the given zip.
      return chain(countiesFromZip(zip!))
        .map(county => [county, zip] as [string, string])

    case ParseMode.INFER_ZIP:
      // If county is defined but zip isn't, default to all zips for
      // the given county.
      return chain(zipsFromCounty(capitalizeWords(county!)))
        .map(zip => [county, zip] as [string, string])

    case ParseMode.WELL_FORMED:
      return chain([[county, zip] as [string, string]])

    case ParseMode.INSUFFICIENT_DATA:
      return chain([])
  }
}

enum ParseMode {
  INFER_COUNTY,
  INFER_ZIP,
  INSUFFICIENT_DATA,
  WELL_FORMED
}

function getParseMode(county: string | null, zip: string | null): ParseMode {
  if (county && zip) {
    return ParseMode.WELL_FORMED
  } else if (county && !zip) {
    return ParseMode.INFER_ZIP
  } else if (!county && zip) {
    return ParseMode.INFER_COUNTY
  } else {
    return ParseMode.INSUFFICIENT_DATA
  }
}

/**

 * @private Exposed for unit testing.
 */
export async function parseServiceAreasCSV(file: File): Promise<[ParseError[], [string, string][]]> {
  let [l, r] = await parse(file)
  return [l, flatten(r)]
}

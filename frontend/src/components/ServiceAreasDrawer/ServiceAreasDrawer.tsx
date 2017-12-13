import { chain, flatten } from 'lodash'
import * as React from 'react'
import { State } from '../../constants/states'
import { COUNTIES_BY_ZIP, ZIPS_BY_COUNTY_BY_STATE } from '../../constants/zipCodes'
import { Store, withStore } from '../../services/store'
import { ColumnDefinition, isEmpty, ParseError, parseRows } from '../../utils/csv'
import { serializeServiceArea } from '../../utils/serializers'
import { capitalizeWords } from '../../utils/string'
import { ClearInputsButton } from '../ClearInputsButton/ClearInputsButton'
import { CountySelector } from '../CountySelector/CountySelector'
import { CSVUploader } from '../CSVUploader/CSVUploader'
import { StateSelector } from '../StateSelector/StateSelector'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ServiceAreasDrawer = withStore(
  'counties',
  'serviceAreas',
  'uploadedServiceAreasFilename'
)(({ store }) =>
  <div>
    <h2>Service Areas</h2>
    <StateSelector
      onChange={store.set('selectedState')}
      value={store.get('selectedState')}
    />

    <hr />

    <div className='Flex -Row -SpaceBetween'>
      <h3>Counties {store.get('counties').length > 0 && `(${store.get('counties').length})`}</h3>
      {store.get('counties').length > 0 && <ClearInputsButton className='-Flex-0' onClearInputs={onClearInputs(store)} small />}
    </div>
    <CountySelector
      onChange={store.set('counties')}
      value={store.get('counties')}
      state={store.get('selectedState')}
    />

    <section className='CSVUploaderSection'>
      <hr />
      <p className='HeavyWeight Muted'>For analysis by ZIP code, upload a CSV</p>
      <div className='Flex -Row'>
        <CSVUploader className='-Flex-0' onUpload={onFileSelected(store)} />
        {store.get('uploadedServiceAreasFilename') && <ClearInputsButton onClearInputs={onClearInputs(store)} />}
      </div>
      <p className='Ellipsis Muted SmallFont'>{
        store.get('uploadedServiceAreasFilename')
          ? `Uploaded ${store.get('uploadedServiceAreasFilename')}`
          : 'Upload valid zip codes and/or counties'
      }</p>
    </section>

  </div >
  )
ServiceAreasDrawer.displayName = 'ServiceAreasDrawer'

function onFileSelected(store: Store) {
  return async (file: File) => {
    let [errors, serviceAreas] = await parseServiceAreasCSV(store)(file)

    // Show just 1 error at a time, because that's what our Snackbar-based UI supports.
    errors.slice(0, 1).forEach(e =>
      store.set('error')(e.toString())
    )

    store.set('counties')(getCounties(serviceAreas))
    store.set('serviceAreas')(serviceAreas.map(([county, zip]) => serializeServiceArea(store.get('selectedState'), county, zip)))
    store.set('uploadedServiceAreasFilename')(file.name)
  }
}

function onClearInputs(store: Store) {
  return () => {
    store.set('counties')([])
    store.set('serviceAreas')([])
    store.set('uploadedServiceAreasFilename')('')
  }
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

let parse = parseRows<[string, string][], { state: State }>(COLUMNS, (([county, zip], rowIndex, { state }) => {

  // validate that zip exists
  if (zip && !(zip in COUNTIES_BY_ZIP)) {
    return new ParseError(rowIndex, 1, COLUMNS[1], `We don't support the zip code "${zip}" yet. Reach out to us at health@bayesimpact.org`)
  }

  // We infer missing zips and counties, so one zip might map to
  // more than one county, and one county maps to many zips.
  let pairs = getCountyAndZip(state, county, zip)
    .map(([county, zip]) => [capitalizeWords(county), zip] as [string, string])

  // validate that counties exist
  let badCounty = pairs.value().find(([county]) => !(county in ZIPS_BY_COUNTY_BY_STATE[state]))
  if (badCounty) {
    return new ParseError(rowIndex, 0, COLUMNS[0], `We don't support county "${badCounty[0]}" yet. Reach out to us at health@bayesimpact.org.`)
  }

  // validate that zip code is in county
  // TODO: consider pre-hashing zips for O(1) lookup
  let badZip = pairs.value().find(([county, zip]) => !ZIPS_BY_COUNTY_BY_STATE[state][county].includes(zip))
  if (badZip) {
    return new ParseError(rowIndex, 1, COLUMNS[1], `County "${badZip[0]}" does not contain ZIP code "${badZip[1]}"`)
  }

  return pairs
    .uniqBy(([c, z]) => serializeServiceArea(state, c, z))
    .value()
}), validateHeaders)

function validateHeaders(columns: ColumnDefinition[], fields: string[]) {
  if (isEmpty(fields[0]) && isEmpty(fields[1])) {
    return [new ParseError(0, 0, columns[0], `Your CSV must define the columns "CountyName" and/or "ZipCode"`)]
  }
  return []
}

function getCountyAndZip(state: State, county: string | null, zip: string | null): Lazy<[string, string][]> {
  switch (getParseMode(county, zip)) {

    case ParseMode.INFER_COUNTY:
      // If county isn't defined but zip is, default to all counties
      // that contain the given zip.
      return chain([[COUNTIES_BY_ZIP[zip!], zip] as [string, string]])

    case ParseMode.INFER_ZIP:
      // If county is defined but zip isn't, default to all zips for
      // the given county.
      return chain(ZIPS_BY_COUNTY_BY_STATE[state][capitalizeWords(county!)])
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
export function parseServiceAreasCSV(store: Store) {
  return async (file: File): Promise<[ParseError[], [string, string][]]> => {
    let [l, r] = await parse(file, { state: store.get('selectedState') })
    return [l, flatten(r)]
  }
}

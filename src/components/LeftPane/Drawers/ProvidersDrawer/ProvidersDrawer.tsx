import { chain } from 'lodash'
import { Drawer } from 'material-ui'
import * as React from 'react'
import { WriteProvidersRequest } from '../../../../services/api'
import { store, withStore } from '../../../../services/store'
import { ColumnDefinition, parseCSV, ParseError, parseRows } from '../../../../utils/csv'
import { CSVUploader } from '../../../CSVUploader/CSVUploader'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ProvidersDrawer = withStore(
  'counties',
  'serviceAreas',
  'uploadedProvidersFilename'
)(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Providers</h2>
    <CSVUploader onUpload={onFileSelected} />
    <p className='Ellipsis Muted SmallFont'>{
      store.get('uploadedProvidersFilename')
        ? `Uploaded ${store.get('uploadedProvidersFilename')}`
        : 'Upload valid list of providers'
    }</p>
  </Drawer>
  )

async function onFileSelected(file: File) {
  let [errors, providers] = await parse(file)

  // Show just 1 error at a time, because that's what our Snackbar-based UI supports.
  errors.slice(0, 1).forEach(e =>
    store.set('error')(e.toString())
  )

  store.set('uploadedProviders')(providers)
  store.set('uploadedProvidersFilename')(file.name)
}

/**
 * TODO: More column name aliases
 */
const COLUMNS = [
  { aliases: ['Address'], required: true },
  { aliases: ['Address 2'] },
  { aliases: ['City'], required: true },
  { aliases: ['State'], required: true },
  { aliases: ['Zip Code'], required: true },
  { aliases: ['NPI'], required: true },
  { aliases: ['Provider Language 1'] },
  { aliases: ['Provider Language 2'] },
  { aliases: ['Provider Language 3'] },
  { aliases: ['Specialty'], required: true }
]

let parse = parseRows(COLUMNS, ([address, address2, city, state, zip,
  npi, language1, language2, language3, specialty]) => {

  let suite = address2 ? `Suite ${address2}` : ''
  let fullAddress = `${address} ${suite} ${city} ${state} ${zip}`
  let languages = [language1, language2, language3].filter(Boolean) as string[]

  return {
    address: fullAddress,
    languages,
    npi: Number(npi),
    specialty: specialty! // TODO
  }
})

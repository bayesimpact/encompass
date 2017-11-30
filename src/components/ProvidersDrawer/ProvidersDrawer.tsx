import Drawer from 'material-ui/Drawer'
import * as React from 'react'
import { Store, withStore } from '../../services/store'
import { parseRows } from '../../utils/csv'
import { normalizeZip } from '../../utils/data'
import { ClearInputsButton } from '../ClearInputsButton/ClearInputsButton'
import { CSVUploader } from '../CSVUploader/CSVUploader'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ProvidersDrawer = withStore('uploadedProvidersFilename')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Providers</h2>
    <CSVUploader onUpload={onFileSelected(store)} />
    <p className='Ellipsis Muted SmallFont'>{
      store.get('uploadedProvidersFilename')
        ? `Uploaded ${store.get('uploadedProvidersFilename')}`
        : 'Upload valid list of providers'
    }</p>
    <ClearInputsButton onClearInputs={onClearInputs(store)} />
  </Drawer>
)

function onFileSelected(store: Store) {
  return async (file: File) => {
    let [errors, providers] = await parse(file)

    // Show just 1 error at a time, because that's what our Snackbar-based UI supports.
    errors.slice(0, 1).forEach(e =>
      store.set('error')(e.toString())
    )

    store.set('uploadedProviders')(providers)
    store.set('uploadedProvidersFilename')(file.name)
  }
}

function onClearInputs(store: Store) {
  return () => {
    store.set('providers')([])
    store.set('uploadedProvidersFilename')('')
    // TODO: Resolve issues in effects.tsx to remove need for this.
    store.set('adequacies')({})
  }
}

/**
 * TODO: More column name aliases
 */
const COLUMNS = [
  { aliases: ['Address'], required: true },
  { aliases: ['City'], required: true },
  { aliases: ['State'], required: true },
  { aliases: ['Postal Code', 'Zip', 'Zip Code'], required: true },
  { aliases: ['NPI'] },
  { aliases: ['Provider Language 1'] },
  { aliases: ['Provider Language 2'] },
  { aliases: ['Provider Language 3'] },
  { aliases: ['Specialty'] }
]

let parse = parseRows(COLUMNS, ([address, city, state, zip,
  npi, language1, language2, language3, specialty]) => {

  let fullAddress = `${address}, ${city}, ${state} ${normalizeZip(zip!)}`
  let languages = [language1, language2, language3].filter(Boolean) as string[]

  return {
    address: fullAddress,
    languages,
    npi: Number(npi),
    specialty
  }
})


import * as React from 'react'
import { Store, withStore } from '../../services/store'
import { parseRows } from '../../utils/csv'
// import { normalizeZip } from '../../utils/formatters'
import { maybeParseFloat } from '../../utils/numbers'
import { ClearInputsButton } from '../ClearInputsButton/ClearInputsButton'
import { CSVUploader } from '../CSVUploader/CSVUploader'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ProvidersUploader = withStore('uploadedProvidersFilename')(({ store }) =>
  <div className='Flex -PullLeft'>
    <CSVUploader label='Upload Providers' onUpload={onFileSelected(store)} />
    <div className='Ellipsis Muted SmallFont'>{
      store.get('uploadedProvidersFilename')
        ? `Uploaded ${store.get('uploadedProvidersFilename')}`
        : ''
    }</div>
    {store.get('uploadedProvidersFilename') && <ClearInputsButton onClearInputs={onClearInputs(store)} />}
  </div>
)
ProvidersUploader.displayName = 'ProvidersUploader'

function onFileSelected(store: Store) {
  return async (file: File) => {
    let [errors, providers] = await parse(file)

    // Show just 1 error at a time, because that's what our Snackbar-based UI supports.
    errors.slice(0, 1).forEach(e =>
      store.set('error')(e.toString())
    )
    store.set('uploadedProviders')(providers)
    // TODO - Handle .extensions of different lengths.
    store.set('uploadedProvidersFilename')(file.name.slice(0, -4))
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
 * Aliases are compared to column names as lowerCase()
 */
const COLUMNS = [
  { aliases: ['Address'], required: false },
  { aliases: ['City'], required: false },
  { aliases: ['State'], required: false },
  { aliases: ['Postal Code', 'Zip', 'ZipCode', 'Zip Code'], required: false },
  { aliases: ['Health Center Type'] },
  { aliases: ['Latitude', 'lat'] },
  { aliases: ['Longitude', 'lon'] },
  { aliases: ['NPI'] },
  { aliases: ['First Name'] },
  { aliases: ['Last Name'] },
  { aliases: ['Name'] },
  { aliases: ['Provider Language 1'] },
  { aliases: ['Provider Language 2'] },
  { aliases: ['Provider Language 3'] },
  { aliases: ['Specialty', 'PCPSpecialty', 'SpecialistSpecialty'] }
]

let parse = parseRows(COLUMNS, ([_address, _city, _state, _zip, center_type,
  latitude, longitude, npi, firstname, lastname, name, language1, language2, language3, specialty]) => {
  // let finalAddress = `${address}, ${city}, ${state} ${normalizeZip(zip!)}`
  let languages = [language1, language2, language3].filter(Boolean) as string[]
  let finalName = [firstname, lastname, name].filter(Boolean).join(' ') as string
  return {
    address: 'NA',
    lat: maybeParseFloat(latitude),
    lng: maybeParseFloat(longitude),
    languages,
    npi: npi ? String(npi) : undefined,
    name: finalName || undefined,
    specialty: specialty || undefined,
    center_type: center_type || undefined
  }
})

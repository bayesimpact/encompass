
import * as React from 'react'
import { Store, withStore } from '../../services/store'
import { ParseError, parseRows } from '../../utils/csv'
import { normalizeZip } from '../../utils/formatters'
import { maybeParseFloat } from '../../utils/numbers'
import { ClearInputsButton } from '../ClearInputsButton/ClearInputsButton'
import { CSVUploader } from '../CSVUploader/CSVUploader'
import './Uploader.css'

// const { ENV } = process.env
let ENV = 'PRD'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 */
export let ProvidersUploader = withStore('uploadedProvidersFilename')(({ store }) =>
  <div className='Flex Uploader'>
    <CSVUploader label='Upload Providers' onUpload={onFileSelected(store)} />
    <span className='Ellipsis Muted SmallFont'>
      {store.get('uploadedProvidersFilename')}
    </span>
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
  { aliases: ['Address'] },
  { aliases: ['City'] },
  { aliases: ['State'] },
  { aliases: ['Postal Code', 'Zip', 'ZipCode', 'Zip Code'] },
  { aliases: ['Health Center Type'] },
  { aliases: ['Latitude', 'lat'] },
  { aliases: ['Longitude', 'long', 'lng'] },
  { aliases: ['NPI'] },
  { aliases: ['First Name'] },
  { aliases: ['Last Name'] },
  { aliases: ['Name'] },
  { aliases: ['Provider Language 1'] },
  { aliases: ['Provider Language 2'] },
  { aliases: ['Provider Language 3'] },
  { aliases: ['Specialty', 'PCPSpecialty', 'SpecialistSpecialty'] }
]

let parse = parseRows(COLUMNS, ([address, city, state, zip, center_type,
  latitude, longitude, npi, firstname, lastname, name, language1, language2, language3, specialty], rowIndex) => {
  let finalAddress = address
  if (address && city && state && zip) {
    finalAddress = `${address}, ${city}, ${state} ${normalizeZip(zip!)}`
  }

  if (ENV === 'PRD' && !(latitude && longitude)) {
    return new ParseError(rowIndex, 5, COLUMNS[5], `Missing latitude or longitude.`)
  }

  if (!address && !(latitude && longitude)) {
    return new ParseError(rowIndex, 0, COLUMNS[0], `Missing address or coordinates.`)
  }

  let languages = [language1, language2, language3].filter(Boolean) as string[]
  let finalName = [firstname, lastname, name].filter(Boolean).join(' ') as string
  return {
    address: finalAddress || 'Coordinates',
    lat: maybeParseFloat(latitude),
    lng: maybeParseFloat(longitude),
    languages,
    npi: npi ? String(npi) : undefined,
    name: finalName || undefined,
    specialty: specialty || undefined,
    center_type: center_type || undefined
  }
})

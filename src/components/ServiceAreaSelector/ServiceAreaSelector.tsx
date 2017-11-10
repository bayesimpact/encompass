import * as React from 'react'
import { StoreProps, withStore } from '../../services/store'
import { formatServiceArea, unformatServiceArea } from '../../utils/formatters'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = StoreProps & {
  onChange(serviceArea: string | null): void
  value: string | null
}

const ALL_SERVICE_AREAS = 'All service areas'

export let ServiceAreaSelector = withStore('serviceAreas')<Props>(({ onChange, store, value }) => {
  console.log('ServiceAreaSelector', value)
  return <Autocomplete
    defaultValue={ALL_SERVICE_AREAS}
    items={store.get('serviceAreas').map(formatServiceArea)}
    onChange={_ => onChange(_ === ALL_SERVICE_AREAS ? null : unformatServiceArea(_))}
    pinnedItems={[ALL_SERVICE_AREAS]}
    value={value === null ? ALL_SERVICE_AREAS : formatServiceArea(value)}
  />
})

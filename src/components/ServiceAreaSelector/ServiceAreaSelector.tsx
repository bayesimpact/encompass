import * as React from 'react'
import { StoreProps, withStore } from '../../services/store'
import { formatServiceArea, unformatServiceArea } from '../../utils/formatters'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = StoreProps & {
  onChange(serviceArea: string): void
  value: string | null
}

export const ALL_SERVICE_AREAS = 'All service areas'

export let ServiceAreaSelector = withStore('serviceAreas')<Props>(({ onChange, store, value }) =>
  <Autocomplete
    items={store.get('serviceAreas').map(formatServiceArea)}
    onChange={_ => onChange(unformatServiceArea(_))}
    pinnedItems={[ALL_SERVICE_AREAS]}
    value={value === null ? null : formatServiceArea(value)}
  />
)

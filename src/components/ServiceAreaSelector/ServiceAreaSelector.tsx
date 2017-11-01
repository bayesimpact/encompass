import * as React from 'react'
import { StoreProps, withStore } from '../../services/store'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = StoreProps & {
  onChange(serviceArea: string | null): void
  value: string | null
}

export const ALL_SERVICE_AREAS = 'All service areas'

export let ServiceAreaSelector = withStore('serviceAreas')<Props>(({ onChange, store, value }) =>
  <Autocomplete
    items={store.get('serviceAreas')}
    onChange={onChange}
    pinnedItems={['All service areas']}
    value={value}
  />
)

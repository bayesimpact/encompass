import * as React from 'react'
import { withStore } from '../../services/store'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = {
  onChange(serviceArea: string | null): void
  value: string | null
}

const ALL_SERVICE_AREAS = 'All service areas'

export let ServiceAreaSelector = withStore('counties')<Props>(({ onChange, store, value }) =>
  <Autocomplete
    defaultValue={ALL_SERVICE_AREAS}
    items={store.get('counties')}
    onChange={_ => onChange(_ === ALL_SERVICE_AREAS ? null : _)}
    pinnedItems={[ALL_SERVICE_AREAS]}
    value={value === null ? ALL_SERVICE_AREAS : value}
  />
)
ServiceAreaSelector.displayName = 'ServiceAreaSelector'

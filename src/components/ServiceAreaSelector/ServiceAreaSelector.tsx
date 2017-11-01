import * as React from 'react'
import { StoreProps, withStore } from '../../services/store'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = StoreProps & {
  onChange(serviceArea: string | null): void
  value: string | null
}

export let ServiceAreaSelector = withStore('serviceAreas')<Props>(({ onChange, store, value }) =>
  <Autocomplete
    items={store.get('serviceAreas')}
    onChange={onChange}
    value={value}
  />
)

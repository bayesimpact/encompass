import * as React from 'react'
import { StoreProps, withStore } from '../../services/store'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = StoreProps & {
  onChange(serviceAreas: string[]): void
  value: string[]
}

export let ServiceAreaSelector = withStore('serviceAreas')<Props>(({ onChange, store, value }) =>
  <Autocomplete
    items={store.get('serviceAreas')}
    onChange={_ => onChange([_])}
    value={value[0]}
  />
)

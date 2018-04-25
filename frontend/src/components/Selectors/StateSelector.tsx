import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { State, STATES } from '../../constants/states'
import { Store } from '../../services/store'

type StateSelectorProps = {
  className?: string
  value: State | null
  store: Store
}

export let StateSelector: React.StatelessComponent<StateSelectorProps> = ({ className, store, value }) =>
  <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => onStateChange(value, store)}
    value={value}
    autoWidth={true}>
    {STATES.map(_ =>
      <MenuItem key={_.shortName} value={_.shortName} primaryText={_.longName} />
    )}
  </DropDownMenu >

function onStateChange(value: State, store: Store) {
  store.set('selectedState')(value)
  store.set('useCustomCountyUpload')(false)
  store.set('selectedCounties')(null)
}

StateSelector.displayName = 'StateSelector'

import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { State, STATES } from '../../constants/states'
import { Store } from '../../services/store'

type StateSelectorProps = {
  className?: string
  value: State | null
  store: Store
}

/**
 * This State Selector is used to select a state to view for US-wide datasets. These datasets
 * include points for the entire US and allow the user to select which states to view.
 */
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

/**
 * As part of State selection, send an event to GA.
 */
function onStateChange(value: State, store: Store) {
  ReactGA.event({
    category: 'Filter',
    action: 'Selected a state in a US-wide dataset',
    label: value.toString()
  })
  store.set('selectedState')(value)
  store.set('useCustomCountyUpload')(false)
  store.set('selectedCounties')(null)
}

StateSelector.displayName = 'StateSelector'

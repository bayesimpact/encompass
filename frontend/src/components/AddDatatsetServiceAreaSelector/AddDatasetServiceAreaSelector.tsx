import { MenuItem, SelectField } from 'material-ui'
import * as React from 'react'
import { DatasetCountySelection } from '../../constants/datatypes'
import { State, STATES } from '../../constants/states'
import { Store, withStore } from '../../services/store'

export let AddDatasetServiceAreaSelector = withStore(
    'selectedState',
    'addDatasetCountySelection'
)(({ store }) =>
    <div>
        <StateSelector
            onChange={state => onStateChange(state, store)}
            value={store.get('selectedState')}
        />
        <CountySelector
            onChange={value => store.set('addDatasetCountySelection')(value)}
            value={store.get('addDatasetCountySelection')}
        />
    </div>
)

function onStateChange(state: State, store: Store) {
    store.set('selectedState')(state)
    store.set('uploadedServiceAreasFilename')(null)
}

type CountySelectorProps = {
    onChange(value: DatasetCountySelection): void
    value: DatasetCountySelection
}

let CountySelector: React.StatelessComponent<CountySelectorProps> = ({ onChange, value }) =>
    <SelectField
        onChange={(_e, _i, value) => onChange(value)}
        value={value}
        hintText='Select Counties'
    >
        <MenuItem key='Custom' value='Custom' primaryText='Custom' />
        <MenuItem key='All' value='All' primaryText='All' />
    </SelectField>

AddDatasetServiceAreaSelector.displayName = 'AddDatasetServiceAreaSelector'

type StateSelectorProps = {
    onChange(value: State): void
    value: string
  }

let StateSelector: React.StatelessComponent<StateSelectorProps> = ({ onChange, value }) =>
    <SelectField
      onChange={(_e, _i, value) => onChange(value)}
      value={value}
    >
      {STATES.map(_ =>
        <MenuItem key={_.shortName} value={_.shortName} primaryText={_.longName} />
      )}
    </SelectField>

  StateSelector.displayName = 'StateSelector'

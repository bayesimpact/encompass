import { MenuItem, SelectField } from 'material-ui'
import * as React from 'react'
import { DatasetCountySelection } from '../../constants/datatypes'
import { State } from '../../constants/states'
import { Store, withStore } from '../../services/store'
import { StateSelector } from '../Selectors/StateSelector'

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

type Props = {
    onChange(value: DatasetCountySelection): void
    value: DatasetCountySelection
}

let CountySelector: React.StatelessComponent<Props> = ({ onChange, value }) =>
    <SelectField
        onChange={(_e, _i, value) => onChange(value)}
        value={value}
        hintText='Select Counties'
    >
        <MenuItem key='Custom' value='Custom' primaryText='Custom' />
        <MenuItem key='All' value='All' primaryText='All' />
    </SelectField>

AddDatasetServiceAreaSelector.displayName = 'AddDatasetServiceAreaSelector'

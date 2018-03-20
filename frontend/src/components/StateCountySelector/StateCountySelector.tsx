import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import * as React from 'react'
import { State, STATES } from '../../constants/states'
import { Store, withStore } from '../../services/store'

const { ENV } = process.env

export let StateCountySelector = withStore(
    'selectedState',
    'useCustomCountyUpload'
)(({ store }) =>
    <div>
        <StateSelector
            onChange={state => onStateChange(state, store)}
            value={store.get('selectedState')}
        />
        <CountySelector
            onChange={value => store.set('useCustomCountyUpload')(value)}
            value={store.get('useCustomCountyUpload')}
        />
    </div>
)

function onStateChange(state: State, store: Store) {
    store.set('selectedState')(state)
    store.set('uploadedServiceAreasFilename')(null)
}

type CountySelectorProps = {
    onChange(value: boolean | null): void
    value: boolean | null
}

let CountySelector: React.StatelessComponent<CountySelectorProps> = ({ onChange, value }) =>
    <SelectField
        onChange={(_e, _i, value) => onChange(value)}
        value={value}
        floatingLabelText='Counties'
        hintText='Select a county'
        floatingLabelFixed={true}
        autoWidth={false}
        style={{ width: 150, paddingLeft: 10 }}
    >
        <MenuItem key='Custom' value={true} primaryText='Custom' disabled={(ENV === 'PRD')} />
        <MenuItem key='All' value={false} primaryText='All' />
    </SelectField>

StateCountySelector.displayName = 'StateCountySelector'

type StateSelectorProps = {
    onChange(value: State): void
    value: string
}

let StateSelector: React.StatelessComponent<StateSelectorProps> = ({ onChange, value }) =>
    <SelectField
        onChange={(_e, _i, value) => onChange(value)}
        value={value}
        floatingLabelText='State'
        floatingLabelFixed={true}
        autoWidth={false}
        style={{ width: 200 }}
    >
        {STATES.map(_ =>
            <MenuItem key={_.shortName} value={_.shortName} primaryText={_.longName} />
        )}
    </SelectField>

StateSelector.displayName = 'StateSelector'

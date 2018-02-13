import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import * as React from 'react'
import { State, STATES } from '../../constants/states'

type Props = {
  onChange(value: State): void
  value: string
}

export let StateSelector: React.StatelessComponent<Props> = ({ onChange, value }) =>
  <SelectField
    onChange={(_e, _i, value) => onChange(value)}
    value={value}
  >
    {STATES.map(_ =>
      <MenuItem key={_.shortName} value={_.shortName} primaryText={_.longName} />
    )}
  </SelectField>

StateSelector.displayName = 'StateSelector'

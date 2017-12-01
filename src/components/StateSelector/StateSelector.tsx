import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import * as React from 'react'
import { STATES } from '../../constants/zipCodes'
import { capitalizeFirstLetter } from '../../utils/formatters'

type Props = {
  onChange(state: string): void
  selectedState: string
}

export let StateSelector: React.StatelessComponent<Props> = ({ onChange, selectedState }) =>
  <SelectField
    value={selectedState}
    onChange={(_e, _i, value: string) => onChange(value)}
  >
    {STATES.map(_ =>
      <MenuItem
        key={_}
        value={_}
        primaryText={capitalizeFirstLetter(_)} />
    )}
  </SelectField>

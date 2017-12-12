import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import * as React from 'react'
import { COUNTIES_BY_STATE } from '../../constants/zipCodes';

type Props = {
  onChange(counties: string[]): void
  selectedCounties: string[]
  state: string
}

export let CountySelector: React.StatelessComponent<Props> = ({ onChange, selectedCounties, state }) =>
  <SelectField
    multiple={true}
    hintText='Select counties'
    value={selectedCounties}
    onChange={(_e, _i, values: string[]) => onChange(values)}
  >
    {COUNTIES_BY_STATE[state].map(_ =>
      <MenuItem
        key={_}
        insetChildren={true}
        checked={selectedCounties.includes(_)}
        value={_}
        primaryText={_} />
    )}
  </SelectField>
CountySelector.displayName = 'CountySelector'

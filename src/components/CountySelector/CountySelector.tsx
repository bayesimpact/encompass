import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import * as React from 'react'

type Props = {
  onChange(counties: string[]): void
  selectedCounties: string[]
  counties: string[]
}

export let CountySelector: React.StatelessComponent<Props> = ({ onChange, counties, selectedCounties }) =>
  <SelectField
    multiple={true}
    hintText='Select counties'
    value={selectedCounties}
    onChange={(_e, _i, values: string[]) => onChange(values)}
  >
    {counties.map(_ =>
      <MenuItem
        key={_}
        insetChildren={true}
        checked={selectedCounties.includes(_)}
        value={_}
        primaryText={_} />
    )}
  </SelectField>

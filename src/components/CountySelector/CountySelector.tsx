import { MenuItem, SelectField } from 'material-ui'
import * as React from 'react'
import { COUNTIES } from '../../constants/zipCodes'

type Props = {
  onChange(counties: string[]): void
  selectedCounties: string[]
}

export let CountySelector: React.StatelessComponent<Props> = ({ onChange, selectedCounties }) =>
  <SelectField
    multiple={true}
    hintText='Select counties'
    value={selectedCounties}
    onChange={(_e, _i, values: string[]) => onChange(values)}
  >
    {COUNTIES.map(_ =>
      <MenuItem
        key={_}
        insetChildren={true}
        checked={selectedCounties.includes(_)}
        value={_}
        primaryText={_} />
    )}
  </SelectField>

import { DropDownMenu, MenuItem } from 'material-ui'
import * as React from 'react'

type Props = {
  disabled?: boolean
  onChange(value: 'serviceArea' | 'total'): void
  value: 'serviceArea' | 'total'
}

export let ViewPicker: React.StatelessComponent<Props> = ({ disabled, onChange, value }) =>
  <DropDownMenu
    className='DropDownMenu -Compact'
    disabled={disabled}
    onChange={(e, i, value) => onChange(value)}
    value={value}
  >
    <MenuItem value='total' primaryText='Total' />
    <MenuItem value='serviceArea' primaryText='Service Area' />
  </DropDownMenu>

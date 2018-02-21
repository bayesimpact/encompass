import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { Format } from '../../constants/datatypes'

type Props = {
  onChange(format: Format): void
  value: Format
  className?: string
}

let options: Format[] = ['Percentage', 'Number']
let menuItems = chain(options).map(
  _ => <MenuItem value={_} key={_} primaryText={_} />
).value()

export let FormatSelector: React.StatelessComponent<Props> = ({ onChange, value, className }) =>
  <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => onChange(value)}
    value={value}>
    {menuItems}
  </DropDownMenu >

FormatSelector.displayName = 'FormatSelector'

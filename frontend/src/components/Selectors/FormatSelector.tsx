import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { Format } from '../../constants/datatypes'

type Props = {
  onChange(format: Format): void
  value: Format
}

let options: Format[] = ['Percentage', 'Number']
let menuItems = chain(options).map(
  _ => <MenuItem value={_} key={_} primaryText={_} />
).value()

export let FormatSelector: React.StatelessComponent<Props> = ({ onChange, value }) =>
  <DropDownMenu
    onChange={(_event, _index, value) => onChange(value)}
    value={value}>
    {menuItems}
  </DropDownMenu >

FormatSelector.displayName = 'FormatSelector'

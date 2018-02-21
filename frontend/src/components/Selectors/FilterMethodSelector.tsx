import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { SelectorMethod } from '../../constants/datatypes'

type Props = {
  className?: string
  onChange(format: SelectorMethod): void
  value: SelectorMethod
}

let options: SelectorMethod[] = ['All', 'County Name', 'County Type']
let menuItems = chain(options).map(
  _ => <MenuItem value={_} key={_} primaryText={_} />
).value()

export let FilterMethodSelector: React.StatelessComponent<Props> = ({ className, onChange, value }) =>
  <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => onChange(value)}
    value={value}>
    {menuItems}
  </DropDownMenu >

FilterMethodSelector.displayName = 'FilterMethodSelector'

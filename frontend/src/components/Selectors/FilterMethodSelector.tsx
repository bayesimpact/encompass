import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { FilterMethod } from '../../constants/datatypes'

type Props = {
  className?: string
  onChange(format: FilterMethod): void
  value: FilterMethod
}

let options: FilterMethod[] = ['All', 'County Name', 'County Type']
let menuItems = chain(options).map(
  _ => <MenuItem value={_} key={_} primaryText={_} />
).value()

export let FilterMethodSelector: React.StatelessComponent<Props> = ({ className, onChange, value }) =>
  <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => {
      ReactGA.event({
        category: 'Filter',
        action: 'Selected a filter type',
        label: value
      })
      onChange(value)
    }}
    value={value}>
    {menuItems}
  </DropDownMenu >

FilterMethodSelector.displayName = 'FilterMethodSelector'

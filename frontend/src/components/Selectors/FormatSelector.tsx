import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { Format } from '../../constants/datatypes'
import { withStore } from '../../services/store'

type Props = {
  onChange(format: Format): void
  value: Format
}

let menuItems: any = []
let options: Format[] = ['Percentage', 'Number']
options.forEach(format => {
  menuItems.push(<MenuItem value={format} key={format} primaryText={format} />)
})

export let FormatSelector = withStore('selectedFormat')<Props>(({ onChange, value }) => {
  return (
    <DropDownMenu
      onChange={(_event, _index, value) => onChange(value)}
      value={value}>
      {menuItems}
    </DropDownMenu >
  )
})

FormatSelector.displayName = 'FormatSelector'

import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { CountyType } from '../../constants/datatypes'

type Props = {
  className?: string
  onChange(format: CountyType): void
  value: CountyType | null
}

const styles = {
  customWidth: {
    width: 120
  }
}

let options: CountyType[] = ['All', 'Rural', 'Urban']
let menuItems = chain(options).map(
  _ => <MenuItem value={_} key={_} primaryText={_} />
).value()

export let CountyTypeSelector: React.StatelessComponent<Props> = ({ className, onChange, value }) =>
  <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => onChange(value)}
    value={value}
    style={styles.customWidth}>
    {menuItems}
  </DropDownMenu >

CountyTypeSelector.displayName = 'CountyTypeSelector'

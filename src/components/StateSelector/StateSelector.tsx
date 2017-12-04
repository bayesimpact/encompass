import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import * as React from 'react'

export let StateSelector: React.StatelessComponent = () =>
  <SelectField value='california'>
    <MenuItem value='california' primaryText='California' />
  </SelectField>
StateSelector.displayName = 'StateSelector'

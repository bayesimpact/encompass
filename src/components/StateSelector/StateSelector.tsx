import { MenuItem, SelectField } from 'material-ui'
import * as React from 'react'

export let StateSelector = () =>
  <SelectField value='california'>
    <MenuItem value='california' primaryText='California' />
  </SelectField>

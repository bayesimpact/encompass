import { difference } from 'lodash'
import { MenuItem, SelectField, TouchTapEvent } from 'material-ui'
import * as React from 'react'
import { COUNTIES } from '../../constants/zipCodes'

type Props = {
  onRemoveCounty(county: string): void
  onSelectCounty(county: string): void
  selectedCounties: string[]
}

export let CountySelector: React.StatelessComponent<Props> = props =>
  <SelectField
    multiple={true}
    hintText='Select counties'
    value={props.selectedCounties}
    onChange={handleChange(props)}
  >
    {COUNTIES.map(_ =>
      <MenuItem
        key={_}
        insetChildren={true}
        checked={props.selectedCounties.includes(_)}
        value={_}
        primaryText={_} />
    )}
  </SelectField>

function handleChange({ onRemoveCounty, onSelectCounty, selectedCounties }: Props) {
  return (e: TouchTapEvent, i: number, values: string[]) => {
    let removedValues = difference(selectedCounties, values)
    removedValues.forEach(onRemoveCounty)
    let selectedValues = difference(values, selectedCounties)
    selectedValues.forEach(onSelectCounty)
  }
}

import { difference } from 'lodash'
import { MenuItem, SelectField } from 'material-ui'
import * as React from 'react'

type Props = {
  counties: {
    [county: string]: {
      zips: string[]
    }
  }
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
    {Object.keys(props.counties).sort().map(_ =>
      <MenuItem
        key={_}
        insetChildren={true}
        checked={props.selectedCounties.includes(_)}
        value={_}
        primaryText={_} />
    )}
  </SelectField>

function handleChange({ onRemoveCounty, onSelectCounty, selectedCounties }: Props) {
  return (_, __, values: string[]) => {
    let removedValues = difference(selectedCounties, values)
    removedValues.forEach(onRemoveCounty)
    let selectedValues = difference(values, selectedCounties)
    selectedValues.forEach(onSelectCounty)
  }
}

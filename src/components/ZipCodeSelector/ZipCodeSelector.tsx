import { Checkbox, List, ListItem, Subheader } from 'material-ui'
import * as React from 'react'
import './ZipCodeSelector.css'

type Props = {
  counties: {
    [county: string]: {
      zips: string[]
    }
  }
  isSelectAllChecked: boolean
  onRemoveCountyZip(zip: string): void
  onSelectAllChange(isInputChecked: boolean): void
  onSelectCountyZip(zip: string): void
  selectedCounties: string[]
  selectedCountyZips: string[]
}

let ZipCodeSelector: React.StatelessComponent<Props> = props =>
  <div className='ZipCodeSelector'>
    {props.selectedCounties.length
      ? <Checkbox
        checked={props.isSelectAllChecked}
        label='Select All'
        onCheck={(_, isInputChecked) => props.onSelectAllChange(isInputChecked)}
      />
      : null}
    {props.selectedCounties.sort().map(countyKey =>
      <List key={countyKey}>
        <Subheader style={{ marginBottom: '-16px' }}>
          {countyKey}
        </Subheader>
        <div className='ZipList'>
          {props.counties[countyKey].zips.sort().map(zip => {
            let countyZipKey = `${countyKey}-${zip}`
            let checkbox = <Checkbox
              checked={props.selectedCountyZips.includes(countyZipKey)}
              onCheck={(_, isInputChecked) => handleChange(props)(countyZipKey, isInputChecked)} />
            return <ListItem
              className='ListItem'
              key={countyZipKey}
              primaryText={zip}
              leftCheckbox={checkbox} />
          })}
        </div>
      </List>
    )}
  </div>

function handleChange(props: Props) {
  return (countyZipKey, isInputChecked) =>
    isInputChecked
      ? props.onSelectCountyZip(countyZipKey)
      : props.onRemoveCountyZip(countyZipKey)
}

import { chain, without } from 'lodash'
import { Checkbox, List, ListItem, Subheader } from 'material-ui'
import * as React from 'react'
import { countyZip, COUNTYZIPS, countyZipsFromCounties, SERVICE_AREAS_TO_ZIPS, ZIP_CODES } from '../../constants/zipCodes'
import './ZipCodeSelector.css'

type Props = {
  counties: string[]
  onChange(countyZips: string[]): void
  selectedCountyZips: string[]
}

export let ZipCodeSelector: React.StatelessComponent<Props> = props => {

  let allCountyZips = countyZipsFromCounties(props.counties)

  return <div className='ZipCodeSelector'>

    <div className='LargeFont ZipCodeSelectorHeadline'>
      Zip Codes
      <div className='MediumFont Muted PullRight'>
        {props.selectedCountyZips.length} selected
      </div>
    </div>

    {props.counties.length
      ? <Checkbox
        checked={areAllSelected(allCountyZips, props.selectedCountyZips)}
        label='Select All'
        onCheck={(_, isInputChecked) => props.onChange(isInputChecked ? allCountyZips : [])}
      />
      : null}
    {props.counties.sort().map(county =>
      <List key={county}>
        <Subheader style={{ marginBottom: '-16px' }}>{county}</Subheader>
        <div className='ZipList'>
          {SERVICE_AREAS_TO_ZIPS[county].map(zip => {
            let key = `${county}-${zip}`
            return <ListItem
              className='ListItem'
              key={key}
              primaryText={zip}
              leftCheckbox={
                <Checkbox
                  checked={props.selectedCountyZips.includes(key)}
                  onCheck={(_, isChecked) => handleChange(props)(isChecked, key)}
                />
              } />
          })}
        </div>
      </List>
    )}
  </div>
}

/**
 * TODO: Is this safe?
 */
function areAllSelected(zips: string[], selectedZips: string[]) {
  return zips.length === selectedZips.length
}

function handleChange(props: Props) {
  return (isChecked: boolean, countyZip: string) =>
    props.onChange(isChecked
      ? [...props.selectedCountyZips, countyZip]
      : without(props.selectedCountyZips, countyZip)
    )
}

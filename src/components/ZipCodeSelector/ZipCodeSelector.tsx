import { without } from 'lodash'
import Checkbox from 'material-ui/Checkbox'
import List from 'material-ui/List'
import ListItem from 'material-ui/List/ListItem'
import Subheader from 'material-ui/Subheader'
import * as React from 'react'
import { COUNTIES_TO_ZIPS, serviceAreasFromCounties } from '../../constants/zipCodes'
import { serializeServiceArea } from '../../utils/serializers'
import './ZipCodeSelector.css'

type Props = {
  counties: string[]
  onChange(serviceAreas: string[]): void
  selectedServiceAreas: string[]
}

export let ZipCodeSelector: React.StatelessComponent<Props> = props => {

  let allServiceAreas = serviceAreasFromCounties(props.counties)

  return <div className='ZipCodeSelector'>

    <div className='LargeFont ZipCodeSelectorHeadline'>
      Zip Codes
      <div className='MediumFont Muted PullRight'>
        {props.selectedServiceAreas.length} selected
      </div>
    </div>

    {props.counties.length
      ? <Checkbox
        checked={areAllSelected(allServiceAreas, props.selectedServiceAreas)}
        label='Select All'
        onCheck={(_, isInputChecked) => props.onChange(isInputChecked ? allServiceAreas : [])}
      />
      : null}
    {props.counties.sort().map(county =>
      <List key={county}>
        <Subheader style={{ marginBottom: '-16px' }}>{county}</Subheader>
        <div className='ZipList'>
          {COUNTIES_TO_ZIPS[county].map(zip => {
            let key = serializeServiceArea('ca', county, zip)
            return <ListItem
              className='ListItem'
              key={key}
              primaryText={zip}
              leftCheckbox={
                <Checkbox
                  checked={props.selectedServiceAreas.includes(key)}
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
function areAllSelected(serviceAreas: string[], selectedServiceAreas: string[]) {
  return serviceAreas.length === selectedServiceAreas.length
}

function handleChange(props: Props) {
  return (isChecked: boolean, serviceArea: string) =>
    props.onChange(isChecked
      ? [...props.selectedServiceAreas, serviceArea]
      : without(props.selectedServiceAreas, serviceArea)
    )
}

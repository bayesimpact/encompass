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

export class ZipCodeSelector extends React.Component<Props> {

  onCheckSelectAll = (_e: React.MouseEvent<HTMLInputElement>, isChecked: boolean) => {
    let allServiceAreas = serviceAreasFromCounties(this.props.counties)
    this.props.onChange(isChecked ? allServiceAreas : [])
  }

  onCheckZip = (e: React.MouseEvent<HTMLInputElement>, isChecked: boolean) =>
    handleChange(this.props)(isChecked, e.currentTarget.value)

  render() {

    let allServiceAreas = serviceAreasFromCounties(this.props.counties)

    return <div className='ZipCodeSelector'>

      <div className='LargeFont ZipCodeSelectorHeadline'>
        Zip Codes
      <div className='MediumFont Muted PullRight'>
          {this.props.selectedServiceAreas.length} selected
      </div>
      </div>

      {this.props.counties.length
        ? <Checkbox
          checked={areAllSelected(allServiceAreas, this.props.selectedServiceAreas)}
          label='Select All'
          onCheck={this.onCheckSelectAll}
        />
        : null}
      {this.props.counties.sort().map(county =>
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
                    checked={this.props.selectedServiceAreas.includes(key)}
                    onCheck={this.onCheckZip}
                    value={key}
                  />
                }
              />
            })}
          </div>
        </List>
      )}
    </div>
  }
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

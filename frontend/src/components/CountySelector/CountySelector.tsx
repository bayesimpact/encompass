import { without } from 'lodash'
import Checkbox from 'material-ui/Checkbox'
import List from 'material-ui/List'
import ListItem from 'material-ui/List/ListItem'
import * as React from 'react'
import { State } from '../../constants/states'
import { COUNTIES_BY_STATE } from '../../constants/zipCodes'

type Props = {
  onChange(value: string[]): void
  state: State
  value: string[]
}

export class CountySelector extends React.Component<Props> {
  areAllCountiesSelected() {
    return COUNTIES_BY_STATE[this.props.state].length === this.props.value.length
  }
  onCheckCounty = (event: React.MouseEvent<HTMLInputElement>, isChecked: boolean) => {
    let county = event.currentTarget.value
    this.props.onChange(isChecked
      ? [...this.props.value, county]
      : without(this.props.value, county)
    )
  }
  onCheckSelectAll = () =>
    this.props.onChange(this.areAllCountiesSelected()
      ? []
      : COUNTIES_BY_STATE[this.props.state]
    )
  render() {
    return <div className='CountySelector'>
      <List>
        <ListItem
          className='ListItem -Compact -Emphasis'
          key='Select All'
          primaryText='Select All'
          leftCheckbox={
            <Checkbox
              checked={this.areAllCountiesSelected()}
              onCheck={this.onCheckSelectAll}
            />
          }
        />
        {COUNTIES_BY_STATE[this.props.state].map(county =>
          <ListItem
            className='ListItem -Compact'
            key={county}
            primaryText={county}
            leftCheckbox={
              <Checkbox
                checked={this.props.value.includes(county)}
                onCheck={this.onCheckCounty}
                value={county}
              />
            }
          />
        )}
      </List>
    </div>
  }
}

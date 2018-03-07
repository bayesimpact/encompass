import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import * as React from 'react'
import { withStore } from '../../services/store'
import './FilterBar.css'

export let FilterBar = withStore('method', 'allowDrivingTime')(({ store }) => {
  return <Paper className='FilterBar' zDepth={1}>
    <div className='Filter -FixedWidthBig'>
      <span>Method</span>
      <DropDownMenu
        className='DropDownMenu -Compact'
        onChange={(_e, _i, value) => store.set('method')(value)}
        value={store.get('method')}
      >
        <MenuItem value='driving_time' primaryText='Driving Time' disabled={!store.get('allowDrivingTime')} />
        <MenuItem value='haversine' primaryText='Haversine Distance' />
      </DropDownMenu>
    </div>
  </Paper>
})
FilterBar.displayName = 'FilterBar'

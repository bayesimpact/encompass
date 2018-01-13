import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import * as React from 'react'
import { withStore } from '../../services/store'
import './FilterBar.css'

export let FilterBar = withStore('method')(({ store }) =>
  <Paper className='FilterBar' zDepth={1}>
    <div className='Filter -FixedWidthBig'>
      <span>Method</span>
      <DropDownMenu
        className='DropDownMenu -Compact'
        onChange={(_e, _i, value) => store.set('method')(value)}
        value={store.get('method')}
      >
        <MenuItem value='driving_distance' primaryText='Driving Distance' />
        <MenuItem value='driving_time' primaryText='Driving Time' />
        <MenuItem value='haversine_distance' primaryText='Haversine Distance' />
      </DropDownMenu>
    </div>
  </Paper>
)
FilterBar.displayName = 'FilterBar'

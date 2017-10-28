import { DropDownMenu, MenuItem, Paper } from 'material-ui'
import * as React from 'react'
import { store, withStore } from '../../services/store'
import './FilterBar.css'

export let FilterBar = withStore('distribution', 'measure', 'standard')(({ store }) =>
  <Paper className='FilterBar' zDepth={1}>

    <div className='Filter'>
      <span>Distribution</span>
      <DropDownMenu
        className='DropDownMenu --Compact'
        onChange={(e, i, value) => store.set('distribution')(value)}
        value={store.get('distribution')}
      >
        <MenuItem value={0.5} primaryText='0.5 miles' />
        <MenuItem value={2.5} primaryText='2.5 miles' />
        <MenuItem value={5} primaryText='5 miles' />
      </DropDownMenu>
    </div>

    <div className='Filter'>
      <span>Adequacy standard</span>
      <DropDownMenu
        className='DropDownMenu --Compact'
        onChange={(e, i, value) => store.set('standard')(value)}
        value={store.get('standard')}
      >
        <MenuItem value='time_distance' primaryText='Time and Distance' />
        <MenuItem value='time' primaryText='Time' />
        <MenuItem value='distance' primaryText='Distance' />
      </DropDownMenu>
    </div>

    <div className='Filter'>
      <span>Measure</span>
      <DropDownMenu
        className='DropDownMenu --Compact'
        onChange={(e, i, value) => store.set('measure')(value)}
        value={store.get('measure')}
      >
        <MenuItem value='15_miles' primaryText='15 miles / 30 min' />
        <MenuItem value='20_miles' primaryText='20 miles / 40 min' />
        <MenuItem value='30_miles' primaryText='30 miles / 60 min' />
      </DropDownMenu>
    </div>

  </Paper>
)

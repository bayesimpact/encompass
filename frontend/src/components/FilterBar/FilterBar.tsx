import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { CONFIG } from '../../config/config'
import { withStore } from '../../services/store'
import './FilterBar.css'

export let FilterBar = withStore(({ store }) => {
  return <Paper className='FilterBar' zDepth={1}>
    <div className='Filter -FixedWidthBig'>
      <span>Measure</span>
      <DropDownMenu
        className='DropDownMenu -Compact'
        onChange={(_e, _i, value) => {
          ReactGA.event({
            category: 'Adequacy',
            action: 'Selected an adequacy type',
            label: value
          })
          store.set('method')(value)
        }}
        value={store.get('method')}
      >
        <MenuItem value='driving_time' primaryText='Driving Time' disabled={!store.get('allowDrivingTime')} />
        <MenuItem value='straight_line' primaryText='Straight-line Distance' />
        <MenuItem value='walking_time' primaryText='Walking Time' disabled={!CONFIG.is_walking_available} />
      </DropDownMenu>
    </div>
  </Paper>
})
FilterBar.displayName = 'FilterBar'

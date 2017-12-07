import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import * as React from 'react'
import { Measure, Standard } from '../../constants/datatypes'
import { TIME_DISTANCES } from '../../constants/timeDistances'
import { withStore } from '../../services/store'
import './FilterBar.css'

export let FilterBar = withStore('distribution', 'measure', 'standard')(({ store }) =>
  <Paper className='FilterBar' zDepth={1}>

    <div className='Filter -FixedWidthSmall'>
      <span>Distribution</span>
      <DropDownMenu
        className='DropDownMenu -Compact'
        onChange={(_e, _i, value) => store.set('distribution')(value)}
        value={store.get('distribution')}
      >
        <MenuItem value={0.5} primaryText='0.5 miles' />
        <MenuItem value={2.5} primaryText='2.5 miles' />
        <MenuItem value={5} primaryText='5 miles' />
      </DropDownMenu>
    </div>

    <div className='Filter -FixedWidthBig'>
      <span>Adequacy standard</span>
      <DropDownMenu
        className='DropDownMenu -Compact'
        onChange={(_e, _i, value) => store.set('standard')(value)}
        value={store.get('standard')}
      >
        <MenuItem value='time_distance' primaryText='Time and Distance' disabled={true} />
        <MenuItem value='time' primaryText='Time' disabled={true} />
        <MenuItem value='distance' primaryText='Distance' />
      </DropDownMenu>
    </div>

    <div className='Filter -FixedWidthBig'>
      <span>Measure</span>
      <DropDownMenu
        className='DropDownMenu -Compact'
        onChange={(_e, _i, value) => store.set('measure')(value)}
        value={store.get('measure')}
      >
        {Array.from(TIME_DISTANCES).map(([miles, mins]) =>
          <MenuItem
            key={miles}
            value={miles}
            primaryText={getMeasureText(miles, mins, store.get('standard'))}
          />
        )}
      </DropDownMenu>
    </div>

  </Paper>
)
FilterBar.displayName = 'FilterBar'

/**
 * Depending on the Standard filter the user selected, we change the units shown
 * in the Measure filter.
 */
function getMeasureText(miles: Measure, mins: number, standard: Standard) {
  switch (standard) {
    case 'distance': return `${miles} miles`
    case 'time': return `${mins} min`
    case 'time_distance': return `${miles} miles / ${mins} min`
  }
}

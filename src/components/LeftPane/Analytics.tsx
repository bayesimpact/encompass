import { Drawer, DropDownMenu, MenuItem } from 'material-ui'
import * as React from 'react'
import { withStore } from '../../services/store'
import { ServiceAreaSelector } from '../ServiceAreaSelector/ServiceAreaSelector'

/**
 * TODO: Show loading indicator while CSV is uploading + parsing
 * or necessary data is being fetched.
 */
export let Analytics = withStore('representativePoints', 'selectedServiceAreas')(({ store }) =>
  <Drawer className='LeftDrawer' open={true}>
    <h2>Analytics</h2>
    <ViewPicker
      disabled={!store.get('serviceAreas').length}
      onChange={_ => store.set('selectedServiceAreas')(
        _ === 'serviceArea'
          ? [store.get('serviceAreas')[0]] // Select 0th service area by default
          : []
      )}
      value={store.get('selectedServiceAreas').length ? 'serviceArea' : 'total'}
    />
    {<ServiceAreaSelector
      onChange={store.set('selectedServiceAreas')}
      value={store.get('selectedServiceAreas')}
    />}
  </Drawer>
)

type ViewPickerProps = {
  disabled?: boolean
  onChange(value: 'serviceArea' | 'total'): void
  value: 'serviceArea' | 'total'
}

let ViewPicker: React.StatelessComponent<ViewPickerProps> = ({ disabled, onChange, value }) =>
  <DropDownMenu
    disabled={disabled}
    onChange={(e, i, value) => onChange(value)}
    value={value}
  >
    <MenuItem value='total' primaryText='Total' />
    <MenuItem value='serviceArea' primaryText='Service Area' />
  </DropDownMenu>

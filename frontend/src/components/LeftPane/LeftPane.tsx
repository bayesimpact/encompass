import { map } from 'lodash'
import Drawer from 'material-ui/Drawer'
import * as React from 'react'
import { withStore } from '../../services/store'
import { AnalyticsDrawer } from '../AnalyticsDrawer/AnalyticsDrawer'
import './LeftPane.css'

let drawers = {
  '/analytics': AnalyticsDrawer
}

export let LeftPane = withStore('route')(({ store }) =>
  <div className={'LeftPane' + (store.get('route') === '/' ? '' : ' -isOpen')}>
    {map(drawers, (Component, route) =>
      <Drawer className='LeftPaneContent' key={route} open={route === store.get('route')} width={320}>
        <Component />
      </Drawer>
    )}
  </div>
)
LeftPane.displayName = 'LeftPane'

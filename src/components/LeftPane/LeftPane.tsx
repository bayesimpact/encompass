import { map } from 'lodash'
import Drawer from 'material-ui/Drawer'
import * as React from 'react'
import { withStore } from '../../services/store'
import { AnalyticsDrawer } from '../AnalyticsDrawer/AnalyticsDrawer'
import { IconBar } from '../IconBar/IconBar'
import { ProvidersDrawer } from '../ProvidersDrawer/ProvidersDrawer'
import { ServiceAreasDrawer } from '../ServiceAreasDrawer/ServiceAreasDrawer'
import './LeftPane.css'

let drawers = {
  '/analytics': AnalyticsDrawer,
  '/providers': ProvidersDrawer,
  '/service-areas': ServiceAreasDrawer
}

export let LeftPane = withStore('route')(({ store }) =>
  <div className={'LeftPane' + (store.get('route') === '/' ? '' : ' -isOpen')}>
    <IconBar />
    {map(drawers, (Component, route) =>
      <Drawer className='LeftPaneContent' key={route} open={route === store.get('route')} width={320}>
        <Component />
      </Drawer>
    )}
  </div>
)

import { map } from 'lodash'
import Drawer from 'material-ui/Drawer'
import * as React from 'react'
import { withRouter } from 'react-router-dom'
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

export let LeftPane = withRouter(({ location: { pathname } }) =>
  <div className={'LeftPane' + (pathname === '/' ? '' : ' -isOpen')}>
    <IconBar />
    {map(drawers, (Component, route) =>
      <Drawer className='LeftPaneContent' key={route} open={route === pathname} width={320}>
        <Component />
      </Drawer>
    )}
  </div>
)

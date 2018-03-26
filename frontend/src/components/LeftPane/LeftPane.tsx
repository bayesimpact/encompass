import { map } from 'lodash'
import Drawer from 'material-ui-next/Drawer'
import * as React from 'react'
import { withStore } from '../../services/store'
import { AddDatasetDrawer } from '../AddDatasetDrawer/AddDatasetDrawer'
import { AnalyticsDrawer } from '../AnalyticsDrawer/AnalyticsDrawer'
import { DatasetsDrawer } from '../DatasetsDrawer/DatasetsDrawer'
import './LeftPane.css'

let drawers = {
  '/analytics': AnalyticsDrawer,
  '/datasets': DatasetsDrawer,
  '/add-data': AddDatasetDrawer
}

export let LeftPane = withStore('route')(({ store }) =>
  <React.Fragment>
    {map(drawers, (Component, route) =>
      <Drawer className='LeftPaneContent' elevation={100} key={route} open={route === store.get('route')}>
        <Component />
      </Drawer>
    )}
  </React.Fragment>
)
LeftPane.displayName = 'LeftPane'

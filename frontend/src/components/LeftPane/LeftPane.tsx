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

export let LeftPane = withStore(({ store }) =>
  <>
    {map(drawers, (Component, route) =>
      <Drawer
        className='LeftPane'
        elevation={6}
        key={route}
        open={route === store.get('route')}
      >
        <Component />
      </Drawer>
    )}
  </>
)
LeftPane.displayName = 'LeftPane'

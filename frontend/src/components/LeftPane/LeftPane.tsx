import { map } from 'lodash'
import Drawer from 'material-ui/Drawer'
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
  <div className={'LeftPane' + (store.get('route') === '/' ? '' : ' -isOpen')}>
    {map(drawers, (Component, route) =>
      <Drawer className='LeftPaneContent' key={route} open={route === store.get('route')} width='40%'>
        <Component />
      </Drawer>
    )}
  </div>
)
LeftPane.displayName = 'LeftPane'

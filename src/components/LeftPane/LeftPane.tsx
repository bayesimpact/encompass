import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { AnalyticsDrawer } from '../AnalyticsDrawer/AnalyticsDrawer'
import { IconBar } from '../IconBar/IconBar'
import { ProvidersDrawer } from '../ProvidersDrawer/ProvidersDrawer'
import { ServiceAreasDrawer } from '../ServiceAreasDrawer/ServiceAreasDrawer'
import './LeftPane.css'

export let LeftPane = () =>
  <div className='LeftPane'>
    <Router>
      <div>
        <IconBar />
        <div className='LeftPaneContent'>
          <Route path='/analytics' component={AnalyticsDrawer} />
          <Route path='/providers' component={ProvidersDrawer} />
          <Route path='/service-areas' component={ServiceAreasDrawer} />
        </div>
      </div>
    </Router>
  </div>

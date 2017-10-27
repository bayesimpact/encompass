import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { IconBar } from '../IconBar/IconBar'
import { Analytics } from './Analytics'
import './LeftPane.css'
import { Providers } from './Providers'
import { ServiceAreas } from './ServiceAreas'
import { Settings } from './Settings'

export let LeftPane = () =>
  <div className='LeftPane'>
    <Router>
      <div>
        <IconBar />
        <div className='LeftPaneContent'>
          <Route path='/analytics' component={Analytics}/>
          <Route path='/providers' component={Providers}/>
          <Route path='/service-areas' component={ServiceAreas}/>
          <Route path='/settings' component={Settings} />
        </div>
      </div>
    </Router>
  </div>

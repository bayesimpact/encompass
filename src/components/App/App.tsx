import { MuiThemeProvider } from 'material-ui/styles'
import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import { IconBar } from '../IconBar/IconBar'
import { Analytics, LeftPane, Providers, ServiceAreas, Settings } from '../LeftPane/LeftPane'
import { MapView } from '../MapView/MapView'
import './App.css'

export let App = () =>
  <MuiThemeProvider>
    <div className='App'>
      <Header />
      <FilterBar />
      <MapView />
      <LeftPane>
        <Router>
          <div>
            <IconBar />
            <Route path='/analytics' component={Analytics}/>
            <Route path='/providers' component={Providers}/>
            <Route path='/service-areas' component={ServiceAreas}/>
            <Route path='/settings' component={Settings} />
          </div>
        </Router>
      </LeftPane>
    </div>
  </MuiThemeProvider>

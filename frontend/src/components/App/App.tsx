import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import { isMobile } from 'react-device-detect'
import '../../services/effects'
import { withStore } from '../../services/store'
import { ErrorBar } from '../ErrorBar/ErrorBar'
import { SuccessBar } from '../ErrorBar/ErrorBar'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import { LeftPane } from '../LeftPane/LeftPane'
import { MapView } from '../MapView/MapView'
import './App.css'

/**
 * Typescript complains about implicit type when using import for this package.
 *
 * Check to see if the client is mobile and display a warning if they are.
 */
if (isMobile){
  alert('Encompass is not optimized for mobile devices yet. Please visit using a desktop browser for better performance and usability.')
}

export let App = withStore('error', 'success')(({ store }) =>
  <MuiThemeProvider>
    <div className='App'>
      <Header />
      <FilterBar />
      <MapView />
      <LeftPane />
      <ErrorBar
        message={store.get('error')}
        onClose={() => store.set('error')(null)}
      />
      <SuccessBar
        message={store.get('success')}
        onClose={() => store.set('success')(null)}
      />
    </div>
  </MuiThemeProvider>
)
App.displayName = 'App'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import '../../services/effects'
import { withStore } from '../../services/store'
import { AlertDialog } from '../AlertDialog/AlertDialog'
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

export let App = withStore('error', 'success', 'alert')(({ store }) =>
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
      <AlertDialog
        message={store.get('alert')}
        onCloseClick={() => store.set('alert')(null)}
      /> : null}
    </div>
  </MuiThemeProvider>
)
App.displayName = 'App'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import '../../services/effects'
import { withStore } from '../../services/store'
import { isWebGLEnabled } from '../../utils/webgl'
import { AlertDialog } from '../AlertDialog/AlertDialog'
import { ErrorBar } from '../ErrorBar/ErrorBar'
import { SuccessBar } from '../ErrorBar/ErrorBar'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import { LeftPane } from '../LeftPane/LeftPane'
import { MapView } from '../MapView/MapView'
import './App.css'

/**
 * Check to see if the client is mobile and display a warning if they are.
 */

/**
 * Check to see if WebGL is supported and if it isn't, offer the user the opportunity to be
 * redirected to instructions for how to enable it.
 */
if (!isWebGLEnabled()){
  if (window.confirm('Unfortunately, WebGL is not enabled in your browser and you will not be able to display the map. Click "OK" to learn more, or "Cancel" to load Encompass without the map.')){
    window.location.href = 'https://get.webgl.org/'
  }
}

export let App = withStore(({ store }) =>
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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import '../../services/effects'
import { withStore } from '../../services/store'
import { ErrorBar } from '../ErrorBar/ErrorBar'
import { SuccessBar } from '../ErrorBar/ErrorBar'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import { LeftPane } from '../LeftPane/LeftPane'
import { MapView } from '../MapView/MapView'
import { withRoutes } from '../Router/Router'
import './App.css'

export let App = withRoutes(withStore('error', 'success')(({ store }) =>
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
))

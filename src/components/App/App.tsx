import { MuiThemeProvider } from 'material-ui/styles'
import * as React from 'react'
import '../../services/effects'
import { withStore } from '../../services/store'
import { ErrorBar } from '../ErrorBar/ErrorBar'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import { LeftPane } from '../LeftPane/LeftPane'
import { MapView } from '../MapView/MapView'
import './App.css'

export let App = withStore('error')(({ store }) =>
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
    </div>
  </MuiThemeProvider>
)

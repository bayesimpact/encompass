import { MuiThemeProvider } from 'material-ui/styles'
import * as React from 'react'
import '../../services/effects'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import { LeftPane } from '../LeftPane/LeftPane'
import { MapView } from '../MapView/MapView'
import './App.css'

export let App = () =>
  <MuiThemeProvider>
    <div className='App'>
      <Header />
      <FilterBar />
      <MapView />
      <LeftPane />
    </div>
  </MuiThemeProvider>

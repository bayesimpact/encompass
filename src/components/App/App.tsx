import { MuiThemeProvider } from 'material-ui/styles'
import * as React from 'react'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import './App.css'

export let App = () =>
  <MuiThemeProvider>
    <div className='App'>
      <Header />
      <FilterBar />
    </div>
  </MuiThemeProvider>

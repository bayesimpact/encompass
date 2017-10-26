import { MuiThemeProvider } from 'material-ui/styles'
import * as React from 'react'
import { Store } from '../../services/store'
import { FilterBar } from '../FilterBar/FilterBar'
import { Header } from '../Header/Header'
import './App.css'

type Props = {
  store: Store
}

export function onChange<K extends keyof Store>(type: K, value: Store[K]): void {
  console.log('onChange', type, value)
}

export let App: React.StatelessComponent<Props> = ({ store }) =>
  <MuiThemeProvider>
    <div className='App'>
      <Header />
      <FilterBar onChange={onChange} store={store} />
    </div>
  </MuiThemeProvider>

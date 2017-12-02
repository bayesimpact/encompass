import * as React from 'react'
import { HashRouter, Route } from 'react-router-dom'

export let withRoutes = (Component: React.ComponentClass): React.StatelessComponent =>
  () => <HashRouter>
    <div>
      <Route path='/' />
      <Route path='/analytics' />
      <Route path='/providers' />
      <Route path='/service-areas' />
      <Component />
    </div>
  </HashRouter>

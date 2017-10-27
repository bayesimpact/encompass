import * as React from 'react'
import './LeftPane.css'

export * from './Analytics'
export * from './Providers'
export * from './ServiceAreas'
export * from './Settings'

export let LeftPane: React.StatelessComponent = ({ children }) =>
  <div className='LeftPane'>
    {children}
  </div>

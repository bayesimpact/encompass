import ProvidersIcon from 'mui-icons/cmdi/account-multiple'
import ChartIcon from 'mui-icons/cmdi/chart-pie'
import MarkerIcon from 'mui-icons/cmdi/map-marker'
import SettingsIcon from 'mui-icons/cmdi/settings'
import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './IconBar.css'

export let IconBar = withRouter(({ location: { pathname } }) =>
  <ul className='IconBar'>
    <li><Link to={pathname === '/service-areas' ? '' : '/service-areas'}><MarkerIcon /></Link></li>
    <li><Link to={pathname === '/providers' ? '' : '/providers'}><ProvidersIcon /></Link></li>
    <li><Link to={pathname === '/analytics' ? '' : '/analytics'}><ChartIcon /></Link></li>
    <li><Link to={pathname === '/settings' ? '' : '/settings'}><SettingsIcon /></Link></li>
  </ul>
)

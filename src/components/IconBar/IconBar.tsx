import ProvidersIcon from 'mui-icons/cmdi/account-multiple'
import ChartIcon from 'mui-icons/cmdi/chart-pie'
import MarkerIcon from 'mui-icons/cmdi/map-marker'
import SettingsIcon from 'mui-icons/cmdi/settings'
import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './IconBar.css'

const links: [string, React.ComponentClass][] = [
  ['/service-areas', MarkerIcon],
  ['/providers', ProvidersIcon],
  ['/analytics', ChartIcon],
  ['/settings', SettingsIcon]
]

export let IconBar = withRouter(({ location: { pathname } }) =>
  <ul className='IconBar'>
    {links.map(([path, Icon]) =>
      <li key={path}><Link
        className={pathname === path ? '-Active' : ''}
        to={pathname === path ? '' : path}
      ><Icon /></Link></li>
    )}
  </ul>
)

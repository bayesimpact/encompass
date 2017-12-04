import ProvidersIcon from 'mui-icons/cmdi/account-multiple'
import ChartIcon from 'mui-icons/cmdi/chart-pie'
import MarkerIcon from 'mui-icons/cmdi/map-marker'
import * as React from 'react'
import { Route } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { Link } from '../Link/Link'
import './IconBar.css'

const links: [Route, React.ComponentClass][] = [
  ['/service-areas', MarkerIcon],
  ['/providers', ProvidersIcon],
  ['/analytics', ChartIcon]
]

export let IconBar = withStore('route')(({ store }) =>
  <ul className='IconBar'>
    {links.map(([key, Icon]) =>
      <li key={key}><Link
        className={store.get('route') === key ? '-Active' : ''}
        to={store.get('route') === key ? '/' : key}
      ><Icon /></Link></li>
    )}
  </ul>
)
IconBar.displayName = 'IconBar'

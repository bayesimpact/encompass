import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './IconBar.css'

export let IconBar = withRouter(({ location: { pathname } }) =>
  <ul className='IconBar'>
    <li><Link to={pathname === '/service-areas' ? '' : '/service-areas'}>S</Link></li>
    <li><Link to={pathname === '/providers' ? '' : '/providers'}>P</Link></li>
    <li><Link to={pathname === '/analytics' ? '' : '/analytics'}>A</Link></li>
    <li><Link to={pathname === '/settings' ? '' : '/settings'}>X</Link></li>
  </ul>
)

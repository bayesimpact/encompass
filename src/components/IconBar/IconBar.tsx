import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './IconBar.css'

export let IconBar = withRouter(({ location: { pathname } }) =>
  <ul className='IconBar'>
    <li><Link to={pathname === '/service-areas' ? '' : '/service-areas'} />S</li>
    <li><Link to={pathname === '/providers' ? '' : '/providers'} />P</li>
    <li><Link to={pathname === '/analytics' ? '' : '/analytics'} />A</li>
    <li><Link to={pathname === '/settings' ? '' : '/settings'} />X</li>
  </ul>
)

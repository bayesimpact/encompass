import { AppBar, IconButton } from 'material-ui'
import GithubIcon from 'mui-icons/cmdi/github'
import * as React from 'react'
import './Header.css'

export let Header = () =>
  <AppBar
    className='Header'
    title='Network Adequacy Explorer'
    iconElementRight={
      <IconButton
        href='https://github.com/bayesimpact/tds-frontend'
        target='_blank'
        tooltip='Go to this project on Github'
        tooltipPosition='bottom-left'
        touch={true}
      ><GithubIcon /></IconButton>
    }
    showMenuIconButton={false}
  />

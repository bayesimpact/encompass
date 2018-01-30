import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import GithubIcon from 'mui-icons/cmdi/github'
import * as React from 'react'
import './Header.css'

let title = 'Encompass' + (process.env.TITLE_SUFFIX ? ' - ' + process.env.TITLE_SUFFIX : '')

export let Header: React.StatelessComponent = () =>
  <AppBar
    className='Header'
    title={title}
    iconElementRight={
      <IconButton
        href='https://github.com/bayesimpact/tds'
        target='_blank'
        tooltip='Go to this project on Github'
        tooltipPosition='bottom-left'
        touch={true}
      ><GithubIcon /></IconButton>
    }
    showMenuIconButton={false}
  />
Header.displayName = 'Header'

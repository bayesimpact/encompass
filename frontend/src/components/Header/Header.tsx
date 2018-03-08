import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import GithubIcon from 'mui-icons/cmdi/github'
import * as React from 'react'
import { withStore } from '../../services/store'
import { AboutDialog } from '../AboutDialog/AboutDialog'
import './Header.css'

let title = 'Encompass' + (process.env.TITLE_SUFFIX ? ' - ' + process.env.TITLE_SUFFIX : '')

export let Header = withStore('isAboutDialogOpen')(({ store }) =>
  < AppBar
    className='Header'
    title={title}
    iconElementRight={
      <div>
        <AboutDialog
          isOpen={store.get('isAboutDialogOpen')}
          onCloseClick={() => store.set('isAboutDialogOpen')(false)} />
        <FlatButton
          label='About'
          onClick={() => store.set('isAboutDialogOpen')(true)}
          style={{ color: '#fff' }} />
        <IconButton
          href='https://github.com/bayesimpact/tds'
          target='_blank'
          tooltip='Go to this project on Github'
          tooltipPosition='bottom-left'
          touch={true}
        > <GithubIcon /></IconButton>
      </div>
    }
    showMenuIconButton={false}
  />
)

Header.displayName = 'Header'

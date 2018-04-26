import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import GithubIcon from 'mui-icons/cmdi/github'
import * as React from 'react'
import { CONFIG } from '../../config/config'
import { withStore } from '../../services/store'
import { SecureLink } from '../../utils/link'
import { AboutDialog } from '../AboutDialog/AboutDialog'
import { MethodsDialog } from '../MethodsDialog/MethodsDialog'
import './Header.css'

let title = 'Encompass' + CONFIG.title_suffix

export let Header = withStore('modal')(({ store }) =>
  < AppBar
    className='Header'
    title={SecureLink('.', title, '_self')}
    iconElementRight={
      <div>
        <AboutDialog
          isOpen={store.get('modal') === 'About'}
          onCloseClick={() => store.set('modal')(null)} />
        <MethodsDialog
          isOpen={store.get('modal') === 'Methods'}
          onCloseClick={() => store.set('modal')(null)} />
        <FlatButton
          label='Methods'
          onClick={() => store.set('modal')('Methods')}
          style={{ color: '#fff' }} />
        <FlatButton
          label='About'
          onClick={() => store.set('modal')('About')}
          style={{ color: '#fff' }} />
        <IconButton
          href='https://github.com/bayesimpact/encompass'
          target='_blank'
          tooltip='Go to this project on GitHub'
          tooltipPosition='bottom-left'
          touch={true}
        > <GithubIcon /></IconButton>
      </div>
    }
    showMenuIconButton={false}
  />
)

Header.displayName = 'Header'

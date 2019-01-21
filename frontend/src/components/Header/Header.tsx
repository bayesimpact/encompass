import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import { white } from 'material-ui/styles/colors'
import GithubIcon from 'mui-icons/cmdi/github'
import * as React from 'react'
import { CONFIG } from '../../config/config'
import { withStore } from '../../services/store'
import { SecureLink } from '../../utils/link'
import { AboutDialog } from '../AboutDialog/AboutDialog'
import { MethodologyDialog } from '../MethodologyDialog/MethodologyDialog'
import './Header.css'

let title = 'Encompass' + CONFIG.title_suffix

export let Header = withStore(({ store }) =>
  < AppBar
    className='Header'
    title={SecureLink('.', title, '_self')}
    iconElementRight={
      <div>
        <AboutDialog
          isOpen={store.get('modal') === 'About'}
          onCloseClick={() => store.set('modal')(null)} />
        <MethodologyDialog
          isOpen={store.get('modal') === 'Methodology'}
          onCloseClick={() => store.set('modal')(null)} />
        <FlatButton
          label='Methodology'
          onClick={() => store.set('modal')('Methodology')}
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
        > <GithubIcon color={white} /></IconButton>
      </div>
    }
    showMenuIconButton={false}
  />
)

Header.displayName = 'Header'

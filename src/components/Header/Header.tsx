import { AppBar } from 'material-ui'
import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'
import './Header.css'

export let Header = () =>
  <AppBar
    className='Header'
    title='Network Adequacy Explorer'
    iconElementRight={
      <FlatButton
        href='https://github.com/bcherny/bayes-mvp'
        label='Github'
        style={{ color: '#fff' }}
        target='_blank'
      />
    }
    style={{
      backgroundColor: '#607D8B'
    }}
  />

import Snackbar from 'material-ui/Snackbar'
import * as React from 'react'
import './ErrorBar.css'

type Props = {
  message: string | null
  onClose(): void
}

const THIRTY_SECONDS = 30000

export let ErrorBar: React.StatelessComponent<Props> = ({ message, onClose }) =>
  <Snackbar
    autoHideDuration={THIRTY_SECONDS}
    className='ErrorBar'
    message={message || ''}
    onRequestClose={onClose}
    open={message !== null}
  />

export let SuccessBar: React.StatelessComponent<Props> = ({ message, onClose }) =>
  <Snackbar
    autoHideDuration={THIRTY_SECONDS}
    className='SuccessBar'
    message={message || ''}
    onRequestClose={onClose}
    open={message !== null}
  />

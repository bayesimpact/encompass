import { Snackbar } from 'material-ui'
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

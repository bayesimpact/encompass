import { FlatButton } from 'material-ui'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import * as React from 'react'
import './AlertDialog.css'

type Props = {
  message: string | null
  onCloseClick: () => void
}

export let AlertDialog: React.StatelessComponent<Props> = ({
  message, onCloseClick
}) => {
  return <Dialog
    autoScrollBodyContent={true}
    open={message !== null}
    // tslint:disable-next-line:jsx-key
    actions={[<FlatButton className='Button -Primary' label='OK' onClick={onCloseClick}/>]}
    onRequestClose={onCloseClick}
    title={
      <div className='DialogCloseButton AlertDialog'>
        <IconButton onClick={onCloseClick}><NavigationClose /></IconButton>
      </div>
    }
  >
    <div>
      <p>
        {message}
      </p>
    </div>
  </Dialog>
}

import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import * as React from 'react'

type Props = {
  message: string
  isOpen: boolean
  onCloseClick: () => void
}

export let AlertDialog: React.StatelessComponent<Props> = ({
  message, isOpen, onCloseClick
}) => {
  return <Dialog
    autoScrollBodyContent={true}
    open={isOpen}
    onRequestClose={onCloseClick}
    title={
      <div className='DialogCloseButton'>
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

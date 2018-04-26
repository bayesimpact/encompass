import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import { NavigationClose } from 'material-ui/svg-icons'
import * as React from 'react'

type Props = {
  isOpen: boolean
  onCloseClick: () => void
}

export let MethodologyDialog: React.StatelessComponent<Props> = ({
  isOpen, onCloseClick
}) => {
  return <Dialog
    autoScrollBodyContent={true}
    open={isOpen}
    onRequestClose={onCloseClick}
    title={
      <div className='DialogCloseButton'>
        <IconButton onClick={onCloseClick}><NavigationClose /></IconButton>
      </div>
    }>
    <div>
      <p>
        we use methods to do things.
      </p>
    </div>
  </Dialog>
}

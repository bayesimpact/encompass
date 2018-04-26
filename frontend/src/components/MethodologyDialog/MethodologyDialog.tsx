import Dialog from 'material-ui/Dialog'
import * as React from 'react'

type Props = {
  isOpen: boolean
  onCloseClick: (buttonClicked: boolean) => void
}

export let MethodologyDialog: React.StatelessComponent<Props> = ({
  isOpen, onCloseClick
}) => {
  return <Dialog
    autoScrollBodyContent={true}
    open={isOpen}
    onRequestClose={onCloseClick}>
    <div>
      <p>
       we use methods to do things.
      </p>
    </div>
  </Dialog>
}

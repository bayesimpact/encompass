import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'

type Props = {
  onClearInputs(): void
}

export let ClearInputsButton: React.StatelessComponent<Props> = ({ onClearInputs }) =>
  <FlatButton
    className='ClearInputsButton Button -Primary'
    containerElement='label'
    primary={true}
    label='clear inputs'
    onClick={onClearInputs} />
ClearInputsButton.displayName = 'ClearInputsButton'

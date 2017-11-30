import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'
import './ClearInputsButton.css'

type Props = {
  onClearInputs(): void
}

export let ClearInputsButton: React.StatelessComponent<Props> = ({ onClearInputs }) =>
  <div className='ClearInputsButton'>
    <FlatButton
      containerElement='label'
      primary={true}
      label='clear inputs'
      onClick={onClearInputs}
    >
    </FlatButton>
  </div>

import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'

type Props = {
  className?: string
  onClearInputs(): void
  small?: true
}

export let ClearInputsButton: React.StatelessComponent<Props> = ({ className, onClearInputs, small }) =>
  <FlatButton
    className={'ClearInputsButton Button' + (className ? ` ${className}` : '') + (small ? ' -Small -Subtle' : '')}
    containerElement='label'
    label='Clear'
    fullWidth={false}
    onClick={onClearInputs} />
ClearInputsButton.displayName = 'ClearInputsButton'

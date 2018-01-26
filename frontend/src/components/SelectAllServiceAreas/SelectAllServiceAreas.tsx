import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'
import './SelectAllServiceAreas.css'

type Props = {
  className?: string,
  onClickSelect(): void
}

export let SelectAllServiceAreas: React.StatelessComponent<Props> = ({ onClickSelect }) =>
  <div>
    <FlatButton
      className='SelectAllServiceAreas Button -Primary'
      label='All'
      labelPosition='before'
      containerElement='label'
      onClick={onClickSelect}
    />
  </div>
SelectAllServiceAreas.displayName = 'SelectAllServiceAreas'

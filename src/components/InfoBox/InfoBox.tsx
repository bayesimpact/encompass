import * as React from 'react'
import './InfoBox.css'

type Props = {
  large?: true
}

export let InfoBox: React.StatelessComponent<Props> = ({ children, large }) =>
  <div className={'InfoBox' + (large ? ' -Large' : '')}>
    {children}
  </div>

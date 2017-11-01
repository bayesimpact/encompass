import * as React from 'react'
import './StatsBox.css'

type Props = {
  className?: string
  withBorders?: true
}

export let StatsBox: React.StatelessComponent<Props> = ({ children, className, withBorders }) =>
  <table className={
    'StatsBox'
    + (className ? ` ${className}` : '')
    + (withBorders ? ' -withBorders' : '')
  }>
    <tbody>{children}</tbody>
  </table>

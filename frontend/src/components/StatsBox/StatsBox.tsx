import * as React from 'react'
import './StatsBox.css'

type Props = {
  className?: string
  withBorders?: true
  withHorizontalLines?: true
}

export let StatsBox: React.StatelessComponent<Props> = ({
  children, className, withBorders, withHorizontalLines
}) =>
  <table className={
    'StatsBox'
    + (className ? ` ${className}` : '')
    + (withBorders ? ' -withBorders' : '')
    + (withHorizontalLines ? ' -withHorizontalLines' : '')
  }>
    <tbody>{children}</tbody>
  </table>

import * as React from 'react'
import './StatsBox.css'

type Props = {
  className?: string
  fixedColumns?: true
  withBorders?: true
  withHorizontalLines?: true
}

export let StatsBox: React.StatelessComponent<Props> = ({
  children, className, fixedColumns, withBorders, withHorizontalLines
}) =>
  <table className={
    'StatsBox'
    + (className ? ` ${className}` : '')
    + (withBorders ? ' -withBorders' : '')
    + (fixedColumns ? ' -withFixedColumnns' : '')
    + (withHorizontalLines ? ' -withHorizontalLines' : '')
  }>
    <tbody>{children}</tbody>
  </table>

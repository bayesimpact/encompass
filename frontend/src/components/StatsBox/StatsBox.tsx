import * as React from 'react'
import './StatsBox.css'

type Props = {
  className?: string
  withFixedColumns?: true
  withBorders?: true
  withHorizontalLines?: true
}

export let StatsBox: React.StatelessComponent<Props> = ({
  children, className, withFixedColumns, withBorders, withHorizontalLines
}) =>
  <table className={
    'StatsBox'
    + (className ? ` ${className}` : '')
    + (withBorders ? ' -withBorders' : '')
    + (withFixedColumns ? ' -withFixedColumns' : '')
    + (withHorizontalLines ? ' -withHorizontalLines' : '')
  }>
    <tbody>{children}</tbody>
  </table>

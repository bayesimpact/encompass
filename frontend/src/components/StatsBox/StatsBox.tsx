import * as React from 'react'
import './StatsBox.css'

type Props = {
  className?: string
  withFixedColumns?: true
  withBorders?: true
  withHorizontalLines?: true
  withSingleRow?: true
}

export let StatsBox: React.StatelessComponent<Props> = ({
  children, className, withFixedColumns, withBorders, withHorizontalLines, withSingleRow
}) =>
  <table className={
    'StatsBox'
    + (className ? ` ${className}` : '')
    + (withBorders ? ' -withBorders' : '')
    + (withFixedColumns ? ' -withFixedColumns' : '')
    + (withHorizontalLines ? ' -withHorizontalLines' : '')
    + (withSingleRow ? ' -withSingleRow' : '')

  }>
    <tbody>{children}</tbody>
  </table>

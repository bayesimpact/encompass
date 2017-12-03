import * as React from 'react'

type Props = {
  name: string
  value: string
}

export let TableRow: React.StatelessComponent<Props> = ({ name, value }) =>
  <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>

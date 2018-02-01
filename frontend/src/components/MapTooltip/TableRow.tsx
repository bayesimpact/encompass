import * as React from 'react'

type Props = {
  name: string
  value: string
}

export let TableRow: React.StatelessComponent<Props> = ({ name, value }) => {
  if (value === null || value === undefined) {
    return null
  }
  return <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>
}

import * as React from 'react'
import { capitalizeWords } from '../../utils/string'

type Props = {
  name: string
  value: string
}

export let TableRow: React.StatelessComponent<Props> = ({ name, value }) => {
  if (!value) {
    return null
  }
  return <tr>
    <td>{capitalizeWords(name)}</td>
    <td>{value}</td>
  </tr>
}

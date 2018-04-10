import * as React from 'react'
import { SecureLink } from '../../utils/link'
import { capitalizeWords } from '../../utils/string'

type Props = {
  name: string
  value: string
}

export let TableRow: React.StatelessComponent<Props> = ({ name, value }) => {
  if (!value) {
    return null
  }
  if (value.toString().includes('http')) {
    return <tr>
      <td>{capitalizeWords(name)}</td>
      <td>{SecureLink(value, 'Direct Link')}</td>
    </tr>
  }
  return <tr>
    <td>{capitalizeWords(name)}</td>
    <td>{value}</td>
  </tr>
}

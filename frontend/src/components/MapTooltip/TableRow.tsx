import * as React from 'react'
import { formatNumber } from '../../utils/formatters'
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
  if (value.toString().includes('https://www.google.com/maps')) {
    return <tr>
      <td>{capitalizeWords(name)}</td>
      <td>{SecureLink(value, 'View on Google Maps')}</td>
    </tr>
  }
  value = isNaN(Number(value)) ? value : formatNumber(Number(value))
  return <tr>
    <td>{capitalizeWords(name)}</td>
    <td>{value}</td>
  </tr>
}

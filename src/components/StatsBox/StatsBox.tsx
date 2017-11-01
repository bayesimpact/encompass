import * as React from 'react'
import './StatsBox.css'

export let StatsBox: React.StatelessComponent = ({ children }) =>
  <table className='StatsBox'><tbody>{children}</tbody></table>

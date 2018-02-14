import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { CENSUS_MAPPING } from '../../constants/census'
import { withStore } from '../../services/store'
import { capitalizeWords, snakeCase } from '../../utils/string'

type Props = {
  onChange(censusCategory: string | null): void
  value: string | null
}

let menuItems: any = []
Object.keys(CENSUS_MAPPING).forEach(censusCategory => {
  menuItems.push(<MenuItem value={censusCategory} key={censusCategory} primaryText={capitalizeWords(censusCategory)} />)
})

menuItems.unshift(<MenuItem value='all' key='all' primaryText='All' />)

export let CensusCategorySelector = withStore('selectedCensusCategory')<Props>(({ onChange, value }) => {
  return (
    <DropDownMenu
      onChange={(_event, _index, value) => onChange(value ? snakeCase(value) : 'All')}
      value={value}>
      {menuItems}
    </DropDownMenu >
  )
})

CensusCategorySelector.displayName = 'CensusCategorySelector'

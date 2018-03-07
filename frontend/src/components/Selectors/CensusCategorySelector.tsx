import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { CENSUS_MAPPING } from '../../constants/census'
import { capitalizeWords, snakeCase } from '../../utils/string'

type Props = {
  onChange(censusCategory: string | null): void
  value: string | null
  className?: string
}

let menuItems = chain(CENSUS_MAPPING)
  .keys()
  .map(_ => <MenuItem value={_} key={_} primaryText={capitalizeWords(_)} />)
  .value()

export let CensusCategorySelector: React.StatelessComponent<Props> = ({ onChange, value, className }) =>
  <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => {
      ReactGA.event({
        category: 'Census Category',
        action: 'Selected a demographic',
        label: value
      })
      onChange(snakeCase(value))
    }}
    value={value}>
    {menuItems}
  </DropDownMenu>

CensusCategorySelector.displayName = 'CensusCategorySelector'

import * as React from 'react'
import { CENSUS_MAPPING, CENSUS_MAPPING_ERROR } from '../../constants/census'
import { withStore } from '../../services/store'
import { capitalizeWords, snakeCase } from '../../utils/string'
import { Autocomplete } from '../Autocomplete/Autocomplete'

type Props = {
  onChange(serviceArea: string | null): void
  value: string | null
}

// const defaultKey = Object.keys(CENSUS_MAPPING)[0] ? Object.keys(CENSUS_MAPPING)[0] : CENSUS_MAPPING_ERROR

export let CensusCategorySelector = withStore('selectedCensusCategory')<Props>(({ onChange, value }) => {
  return <Autocomplete
    items={[]}
    onChange={_ => onChange(snakeCase(_))}
    pinnedItems={Object.keys(CENSUS_MAPPING).map(_ => capitalizeWords(_))}
    value={value === null ? CENSUS_MAPPING_ERROR : capitalizeWords(value)}
  />
})

CensusCategorySelector.displayName = 'CensusCategorySelector'

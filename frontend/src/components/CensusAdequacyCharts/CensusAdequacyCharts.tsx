import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import { tail } from 'lodash'
import * as React from 'react'
import { CENSUS_MAPPING } from '../../constants/census'
import { withStore } from '../../services/store'
import { summaryStatisticsByServiceAreaAndCensus } from '../../utils/data'
import { CensusDataChart } from '../CensusDataChart/CensusDataChart'

type Props = {
  serviceAreas: string[],
  censusCategory: string
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */

export let CensusAdequacyCharts = withStore('adequacies', 'method')<Props>(({ serviceAreas, censusCategory, store }) => {
  let method = store.get('method')

  // Calculate summaryStatistics for each group.
  let populationByAdequacyByGroup = summaryStatisticsByServiceAreaAndCensus(serviceAreas, censusCategory, store)
  let censusGroups = ['Total Population'].concat(CENSUS_MAPPING[censusCategory])

  return <div>
    <CensusDataChart
      percent={true}
      measurementMethod={method}
      censusGroups={censusGroups}
      populationByAdequacyByGroup={populationByAdequacyByGroup}
    />
    <CensusDataChart
      percent={false}
      measurementMethod={method}
      censusGroups={tail(censusGroups)} // Don't include total population in absolute value chart.
      populationByAdequacyByGroup={populationByAdequacyByGroup}
    />
  </div>
})

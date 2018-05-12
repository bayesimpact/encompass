import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import { isEmpty } from 'lodash'
import CircularProgress from 'material-ui/CircularProgress'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import * as React from 'react'
import { CENSUS_MAPPING } from '../../constants/census'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Format, PopulationByAdequacy } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { getLegend } from '../../utils/adequacy'
import { summaryStatisticsByServiceAreaAndCensus } from '../../utils/data'
import { formatNumber, formatPercentage } from '../../utils/formatters'

type Props = {
  serviceAreas: string[],
  censusCategory: string
}

// Force first column to be larger than the other ones.
let firstColumnStyle: React.CSSProperties = {
  width: '30%',
  whiteSpace: 'normal'
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */
// (Chart as any).defaults.global.legend.labels.usePointStyle = true

export let CensusAdequacyTable = withStore<Props>(({ serviceAreas, censusCategory, store }) => {
  if (isEmpty(store.get('adequacies'))) {
    return <div className='CensusAdequacyTable Flex -Center'>
      <CircularProgress
        size={150}
        thickness={8}
        color={ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0]}
      />
    </div>
  }

  let format = store.get('selectedFormat')
  let method = store.get('method')

  // Calculate summaryStatistics for each group.
  let populationByAdequacyByGroup = summaryStatisticsByServiceAreaAndCensus(serviceAreas, censusCategory, store)
  let censusGroups = ['Total Population'].concat(CENSUS_MAPPING[censusCategory])

  return <div>
    <Table className='MuiTable'
      onRowSelection={rows => {
        if (rows.length) {
          store.set('selectedCensusGroup')(censusGroups[Number(rows[0].toString())])
        }
      }
      }
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn style={firstColumnStyle}>Group</TableHeaderColumn>
          <TableHeaderColumn className='RightAlignedCell'>{getLegend(method, AdequacyMode.ADEQUATE_0)}</TableHeaderColumn>
          <TableHeaderColumn className='RightAlignedCell'>{getLegend(method, AdequacyMode.ADEQUATE_1)}</TableHeaderColumn>
          <TableHeaderColumn className='RightAlignedCell'>{getLegend(method, AdequacyMode.ADEQUATE_2)}</TableHeaderColumn>
          <TableHeaderColumn className='RightAlignedCell'>{getLegend(method, AdequacyMode.INADEQUATE)}</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
        showRowHover={true}
        deselectOnClickaway={false}
      >
        {
          censusGroups.map(censusGroup =>
            adequacyRowByCensusGroup(censusGroup, populationByAdequacyByGroup[censusGroup], format, censusGroup === store.get('selectedCensusGroup'))
          )
        }
      </TableBody>
    </Table>
  </div>
})

function adequacyRowByCensusGroup(censusGroup: string, populationByAdequacy: PopulationByAdequacy, format: Format, selected: boolean) {
  let totalPopulation = populationByAdequacy.reduce((a: number, b: number) => a + b)
  return (
    <TableRow selected={selected}>
      <TableRowColumn style={firstColumnStyle}>{censusGroup}</TableRowColumn>
      {
        populationByAdequacy.map(_ => {
          if (format === 'Percentage') {
            return (<TableRowColumn className='RightAlignedCell'>{formatPercentage(100 * _ / totalPopulation)}</TableRowColumn>)
          } else {
            return (<TableRowColumn className='RightAlignedCell'>{formatNumber(_)}</TableRowColumn>)
          }
        })
      }
    </TableRow>
  )
}

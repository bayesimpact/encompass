import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import * as React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { StatisticsByGroup } from '../../utils/data'
import { getLegend } from '../MapLegend/MapLegend'

type Props = {
    measurementMethod: Method,
    censusGroups: string[],
    populationByAdequacyByGroup: StatisticsByGroup
  }

export let CensusAbsoluteValueChart: React.StatelessComponent<Props> = ({ measurementMethod, censusGroups, populationByAdequacyByGroup}) => {
    let adequacyModes = [AdequacyMode.ADEQUATE_15, AdequacyMode.ADEQUATE_30, AdequacyMode.ADEQUATE_60, AdequacyMode.INADEQUATE]
    let datasets = adequacyModes.map((mode, idx) => {
        return {
        backgroundColor: ADEQUACY_COLORS[mode],
        label: getLegend(measurementMethod, mode),
        data: censusGroups.map(_ => populationByAdequacyByGroup[_][idx])
    }})

    return (
        <HorizontalBar
            data={{
                labels: censusGroups,
                datasets
            }}
            options={{
                scales: {
                    xAxes: [{
                        scaleLabel: { display: true, labelString: 'Population by Access' }
                    }]
                }
            }}
        />
    )
}

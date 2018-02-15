import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import * as React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { StatisticsByGroup } from '../../utils/data'
import { getLegend } from '../MapLegend/MapLegend'

type Props = {
    percent: boolean,
    measurementMethod: Method,
    censusGroups: string[],
    populationByAdequacyByGroup: StatisticsByGroup
}

export let CensusDataChart: React.StatelessComponent<Props> = ({ percent, measurementMethod, censusGroups, populationByAdequacyByGroup }) => {
    let adequacyModes = [AdequacyMode.ADEQUATE_15, AdequacyMode.ADEQUATE_30, AdequacyMode.ADEQUATE_60, AdequacyMode.INADEQUATE]
    let datasets = adequacyModes.map((mode, idx) => {
        return {
            backgroundColor: ADEQUACY_COLORS[mode],
            label: getLegend(measurementMethod, mode),
            data: censusGroups.map(_ => populationByAdequacyByGroup[_][idx])
        }
    })
    let options

    if (percent) {
        options = {
            scales: {
                yAxes: [
                    { stacked: true }
                ],
                xAxes: [{
                    scaleLabel: { display: true, labelString: 'Percentage of Population by Access' }
                }]
            },
            plugins: {
                stacked100: { enable: true }
            }
        }
    } else {
        options = {
            scales: {
                xAxes: [{
                    scaleLabel: { display: true, labelString: 'Population by Access' }
                }]
            }
        }
    }

    return (
        <HorizontalBar
            data={{
                labels: censusGroups,
                datasets
            }}
            options={options}
        />
    )
}

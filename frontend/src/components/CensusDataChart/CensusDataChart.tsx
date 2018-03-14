import { ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import { merge } from 'lodash'
import * as React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { StatisticsByGroup } from '../../utils/data'
import { formatNumber, formatPercentage } from '../../utils/formatters'
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
    let xLabel = percent ? 'Percentage of Population by Access' : 'Population by Access'

    let formatTooltipLabel = (tooltipItem: ChartTooltipItem, data: any) => {
        let label = data.datasets[tooltipItem.datasetIndex!].label
        if (percent) {
            let percentData = data.calculatedData[tooltipItem.datasetIndex!][tooltipItem.index!]
            return `${label}: ${formatPercentage(percentData)} (${formatNumber(Number(tooltipItem.xLabel))})`
        }
        return `${label}: ${formatNumber(Number(tooltipItem.xLabel))}`
    }

    let formatxAxisLabels = (value: any) => {return percent ? `${formatPercentage(value, 0)}` : `${formatNumber(value)}`}

    let options = {
        scales: {
            xAxes: [{
                scaleLabel: { display: true, labelString: xLabel },
                ticks: {
                    callback: formatxAxisLabels
                }
            }]
        },
        tooltips: {
            callbacks: {label: formatTooltipLabel}
        }
    }

    let percentOptions = {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            },
            plugins: {
                stacked100: { enable: true }
            }
        }

    return (
        <HorizontalBar
            data={{
                labels: censusGroups,
                datasets
            }}
            options={percent ? merge(options, percentOptions) : options}
        />
    )
}

import { ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import { merge } from 'lodash'
import * as React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { StatisticsByGroup } from '../../utils/data'
import { formatAxisNumber, formatNumber, formatPercentage } from '../../utils/formatters'
import { getLegend } from '../MapLegend/MapLegend'

type Props = {
    percent: boolean,
    measurementMethod: Method,
    censusGroups: string[],
    populationByAdequacyByGroup: StatisticsByGroup
}

export let CensusDataChart: React.StatelessComponent<Props> = ({ percent, measurementMethod, censusGroups, populationByAdequacyByGroup }) => {
    let adequacyModes = [AdequacyMode.ADEQUATE_0, AdequacyMode.ADEQUATE_1, AdequacyMode.ADEQUATE_2, AdequacyMode.INADEQUATE]
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

    let formatxAxisLabels = (value: any) => { return percent ? `${formatPercentage(value, 0)}` : `${formatAxisNumber(value)}` }
    let xAxisHeight = 40
    let legendHeight = 45
    let percentBarWidth = 32
    let numberBarWidth = 12
    let barPadding = 8

    let chartHeight: number = percent ? censusGroups.length * (percentBarWidth + barPadding) + legendHeight + xAxisHeight :
        censusGroups.length * ((numberBarWidth * 4) + barPadding) + xAxisHeight

    let options = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                scaleLabel: { display: true, labelString: xLabel },
                ticks: {
                    callback: formatxAxisLabels
                }
            }],
            yAxes: [{
                barThickness: numberBarWidth
            }]
        },
        tooltips: {
            callbacks: { label: formatTooltipLabel }
        },
        legend: {
            display: false,
            labels: {
                padding: 20,
                boxWidth: 20
            }
        }
    }

    let percentOptions = {
        scales: {
            yAxes: [{
                stacked: true,
                barThickness: percentBarWidth
            }]
        },
        plugins: {
            stacked100: { enable: true }
        },
        legend: {
            display: true
        }
    }
    return (
        <div style={{ height: `${chartHeight}px`, position: 'relative' }}>
            <HorizontalBar
                data={{
                    labels: censusGroups,
                    datasets
                }}
                options={percent ? merge(options, percentOptions) : options}
            />
        </div>
    )
}

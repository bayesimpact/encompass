import { Chart, ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import { merge } from 'lodash'
import * as React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { StatisticsByGroup } from '../../utils/data'
import { formatLabel, formatLargeNumberWithUnit, formatNumber, formatPercentage } from '../../utils/formatters'
import { getLegend } from '../MapLegend/MapLegend'

type Props = {
    percent: boolean,
    measurementMethod: Method,
    censusGroups: string[],
    populationByAdequacyByGroup: StatisticsByGroup
}

// Dimensions for determining chart height.
const percentChartBarWidth = 32
const numberChartBarWidth = 12
const xAxisHeight = 40
const legendHeight = 45
const barPadding = 8

// Font sizes and dimensions for chart labels.
const yLabelWidth = 140
const titleFontSize = 14
const defaultFontSize = 12

Chart.defaults.global.defaultFontFamily = 'Roboto, sans-serif'
Chart.defaults.global.defaultFontSize = defaultFontSize

export let CensusDataChart: React.StatelessComponent<Props> = ({ percent, measurementMethod, censusGroups, populationByAdequacyByGroup }) => {

    let adequacyModes = [AdequacyMode.ADEQUATE_0, AdequacyMode.ADEQUATE_1, AdequacyMode.ADEQUATE_2, AdequacyMode.INADEQUATE]
    let datasets = adequacyModes.map((mode, idx) => {
        return {
            borderWidth: 0,
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

    let formatxAxisLabels = (value: any) => { return percent ? `${formatPercentage(value, 0)}` : `${formatLargeNumberWithUnit(value)}` }

    let chartHeight: number = percent ? censusGroups.length * (percentChartBarWidth + barPadding) + legendHeight + xAxisHeight :
        censusGroups.length * ((numberChartBarWidth * 4) + barPadding) + xAxisHeight

    let options = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: xLabel,
                    fontSize: titleFontSize,
                    fontStyle: 'bold',
                    fontColor: 'rgba(0, 0, 0, 0.87)' // Default Material-UI opacity.
                },
                ticks: {
                    callback: formatxAxisLabels
                }
            }],
            yAxes: [{
                barThickness: numberChartBarWidth,
                afterFit: (scaleInstance: any) => {
                    scaleInstance.width = yLabelWidth
                },
                ticks: {
                    labelOffset: -7
                }
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
                barThickness: percentChartBarWidth
            }],
            xAxes: [{
                scaleLabel: {
                    fontSize: titleFontSize
                }
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
        <div className='CensusDataChart' style={{ height: `${chartHeight}px`, position: 'relative' }}>
            <HorizontalBar
                data={{
                    labels: censusGroups.map(group => formatLabel(group, 22)),
                    datasets
                }}
                options={percent ? merge(options, percentOptions) : options}
            />
        </div>
    )
}

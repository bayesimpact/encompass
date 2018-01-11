import { LngLat } from 'mapbox-gl'
import * as React from 'react'
import { Popup } from 'react-mapbox-gl'
import { GeoJSONEventData } from '../../constants/datatypes'
import { formatCoordinate } from '../../utils/formatters'
import './MapTooltip.css'
import { TableRow } from './TableRow'

type MapTooltipProps = {
  coordinates: LngLat
}

let MapTooltip: React.StatelessComponent<MapTooltipProps> = ({ children, coordinates }) => {
  return (
    <Popup
    anchor='bottom'
    className='MapTooltip'
    coordinates={coordinates.toArray()}
    offset={[0, -20]}
  >
  {children}
  </Popup>
  )
}

type Props = {
  point: GeoJSONEventData
}

/**
 * TODO: expose info for all providers with the same address,
 * not only the first one.
 */
export let ProviderPopup: React.StatelessComponent<Props> =
  ({ point: { features, lngLat } }) => {
    console.log('features')
    let index = 0
    let maxIndex = features.length - 1
    console.log(maxIndex)
    return (
      <MapTooltip coordinates={lngLat}>
      <table>
        <tbody>
          <TableRow name='Address' value={features[index].properties.address} />
          <TableRow name='Specialty' value={features[index].properties.specialty} />
          <TableRow name='Lat' value={formatCoordinate(lngLat.lat)} />
          <TableRow name='Lng' value={formatCoordinate(lngLat.lng)} />
        </tbody>
    </table>
    <div className='controls'>
      <button className='toggle toggle--prev' onClick={() => _TogglePrev(index)}>Prev</button>
      <button className='toggle toggle--next' onClick={() => _ToggleNext(index, maxIndex)}> Next</button>
    </div>
    </MapTooltip>
    )
  }

function _ToggleNext(index: number, maxIndex: number) {
  console.log('toggle next')
  if (index === maxIndex)
    return index
  return index + 1
}

function _TogglePrev(index: number) {
  console.log('toggle prev')
  if (index === 0)
    return index
  return index - 1
}

export let RepresentativePointPopup: React.StatelessComponent<Props> =
  ({ point: { features, lngLat } }) =>
    <MapTooltip coordinates={lngLat}>
    <table>
      <tbody>
        <TableRow name='County' value={features[0].properties.county} />
        <TableRow name='ZIP' value={features[0].properties.zip} />
        <TableRow name='Population' value={features[0].properties.population} />
        <TableRow name='Lat' value={formatCoordinate(lngLat.lat)} />
        <TableRow name='Lng' value={formatCoordinate(lngLat.lng)} />
      </tbody>
    </table>
    </MapTooltip>

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

let MapTooltip: React.StatelessComponent<MapTooltipProps> = ({ children, coordinates }) =>
  <Popup
    anchor='bottom'
    className='MapTooltip'
    coordinates={coordinates.toArray()}
    offset={[0, -20]}
  >
    <table>
      <tbody>
        {children}
      </tbody>
    </table>
  </Popup>

type Props = {
  point: GeoJSONEventData
}

/**
 * TODO: expose info for all providers with the same address,
 * not only the first one.
 */
export let ProviderPopup: React.StatelessComponent<Props> =
  ({ point: { features, lngLat } }) =>
    <MapTooltip coordinates={lngLat}>
      <TableRow name='Address' value={features[0].properties.address} />
      <TableRow name='Specialty' value={features[0].properties.specialty} />
      <TableRow name='Lat' value={formatCoordinate(lngLat.lat)} />
      <TableRow name='Lng' value={formatCoordinate(lngLat.lng)} />
    </MapTooltip>

export let RepresentativePointPopup: React.StatelessComponent<Props> =
  ({ point: { features, lngLat } }) =>
    <MapTooltip coordinates={lngLat}>
      <TableRow name='County' value={features[0].properties.county} />
      <TableRow name='ZIP' value={features[0].properties.zip} />
      <TableRow name='Population' value={features[0].properties.population} />
      <TableRow name='Lat' value={formatCoordinate(lngLat.lat)} />
      <TableRow name='Lng' value={formatCoordinate(lngLat.lng)} />
    </MapTooltip>

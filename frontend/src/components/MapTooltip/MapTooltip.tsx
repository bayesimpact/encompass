import { LngLat } from 'mapbox-gl'
import * as React from 'react'
import { Popup } from 'react-mapbox-gl'
import { GeoJSONEventData } from '../../constants/datatypes'
import { Store } from '../../services/store'
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

type ProviderProps = {
  store: Store
  point: GeoJSONEventData
}

type RepresentativePointProps = {
  point: GeoJSONEventData
}

function _ToggleNexProvider(store: Store, maxIndex: number) {
  console.log('toggle next')
  let index = store.get('providerIndex')
  if (store.get('providerIndex') === maxIndex)
    return
  store.set('providerIndex')(index + 1)
}

function _TogglePrevProvider(store: Store) {
  console.log('toggle prev')
  let index = store.get('providerIndex')
  if (index === 0)
    return
  store.set('providerIndex')(index - 1)
}

/**
 * TODO: expose info for all providers with the same address,
 * not only the first one.
 */
export let ProviderPopup: React.StatelessComponent<ProviderProps> =
  ({ store, point: { features, lngLat } }) => {
    console.log('features')
    let index = store.get('providerIndex')
    let maxIndex = features.length - 1
    let indexMessage = (index + 1) + ' out of ' + (maxIndex + 1)
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
        <button className='toggle toggle--prev' onClick={() => _TogglePrevProvider(store)}>Prev</button>
        <button className='toggle toggle--next' onClick={() => _ToggleNexProvider(store, maxIndex)}>Next</button>
        {indexMessage}
      </div>
    }
    </MapTooltip>
    )
  }

export let RepresentativePointPopup: React.StatelessComponent<RepresentativePointProps> =
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

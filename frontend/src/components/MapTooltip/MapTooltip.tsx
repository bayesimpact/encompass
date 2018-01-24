import { LngLat } from 'mapbox-gl'
import { IconButton } from 'material-ui'
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import * as React from 'react'
import { Popup } from 'react-mapbox-gl'
import { GeoJSONEventData } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
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
  point: GeoJSONEventData
}

type RepresentativePointProps = {
  point: GeoJSONEventData
}

function _toggleNextProvider(store: Store, maxIndex: number) {
  let index = store.get('providerIndex')
  if (index === maxIndex)
    return
  store.set('providerIndex')(index + 1)
}

function _togglePrevProvider(store: Store) {
  let index = store.get('providerIndex')
  if (index === 0)
    return
  store.set('providerIndex')(index - 1)
}

/**
 * TODO: expose info for all providers with the same address,
 * not only the first one.
 */
export let ProviderPopup = withStore('providerIndex')<ProviderProps>(({ store, point: { features, lngLat } }) => {
    let index = store.get('providerIndex')
    let maxIndex = features.length - 1
    let indexMessage = (index + 1) + ' of ' + (maxIndex + 1)
    return (
      <MapTooltip coordinates={lngLat}>
        <table>
          <tbody>
            <TableRow name='NPI' value={features[index].properties.npi} />
            <TableRow name='Address' value={features[index].properties.address} />
            <TableRow name='Specialty' value={features[index].properties.specialty} />
            <TableRow name='Lat' value={formatCoordinate(lngLat.lat)} />
            <TableRow name='Lng' value={formatCoordinate(lngLat.lng)} />
          </tbody>
        </table>
        <div className='controls Flex -Center'>
          <IconButton touchRippleColor='white' onClick={() => _togglePrevProvider(store)}>
            <KeyboardArrowLeft className='icon-button' />
          </IconButton>
          {indexMessage}
          <IconButton touchRippleColor='white' onClick={() => _toggleNextProvider(store, maxIndex)}>
            <KeyboardArrowRight className='icon-button'/>
          </IconButton>
        </div >
      </MapTooltip >
    )
  }
)

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

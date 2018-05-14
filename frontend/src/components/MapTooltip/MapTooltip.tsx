import { LngLat } from 'mapbox-gl'
import IconButton from 'material-ui/IconButton'
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import * as React from 'react'
import { Popup } from 'react-mapbox-gl'
import { GeoJSONEventData } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import './MapTooltip.css'
import { TableRow } from './TableRow'

const providerPointTooltipExclusion: string[] = ['lat', 'lng']
const representativePointTooltipExclusion: string[] = ['adequacyMode', 'demographics', 'zip', 'service_area_id']

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

export let ProviderPopup = withStore<ProviderProps>(({ store, point: { features, lngLat } }) => {
  let index = store.get('providerIndex')
  let maxIndex = features.length - 1
  let indexMessage = (index + 1) + ' of ' + (maxIndex + 1)
  let { properties } = features[index]
  return <MapTooltip coordinates={lngLat}>
    <table>
      <tbody>
        {properties &&
          <>
            {Object.keys(properties).map((key: string) => providerPointTooltipExclusion.includes(key) ? null : <TableRow name={key.toString()} value={properties === null ? null : properties[key]} key={key} />)}
          </>
        }
      </tbody>
    </table>
    <div className='controls Flex -Center'>
      <IconButton touchRippleColor='white' onClick={() => _togglePrevProvider(store)}>
        <KeyboardArrowLeft className='icon-button' />
      </IconButton>
      {indexMessage}
      <IconButton touchRippleColor='white' onClick={() => _toggleNextProvider(store, maxIndex)}>
        <KeyboardArrowRight className='icon-button' />
      </IconButton>
    </div >
  </MapTooltip >
})

export let RepresentativePointPopup: React.StatelessComponent<RepresentativePointProps> =
  ({ point: { features, lngLat } }) => {
    let { properties } = features[0]
    return <MapTooltip coordinates={lngLat}>
      <table>
        <tbody>
          {properties &&
            <>
              {Object.keys(properties).map((key: string) => representativePointTooltipExclusion.includes(key) ? null : <TableRow name={key.toString()} value={properties === null ? null : properties[key]} key={key} />)}
            </>
          }
        </tbody>
      </table>
    </MapTooltip>
  }

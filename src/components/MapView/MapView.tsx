import * as MapboxGL from 'mapbox-gl'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, Popup, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { Store, withStore } from '../../services/store'
import { boundingBox, providersToGeoJSON, representativePointsToGeoJSON } from '../../utils/geojson'
import './MapView.css'

const { MAPBOX_TOKEN } = process.env

if (!MAPBOX_TOKEN) {
  throw 'Please define MAPBOX_TOKEN env var'
}

let Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
})

const representativePointCircleStyle: MapboxGL.CirclePaint = {
  'circle-color': {
    property: 'isAdequate',
    type: 'categorical',
    stops: [
      ['true', '#3F51B5'],
      ['false', '#DE5B5C'],
      ['undefined', '#8eacbb']
    ]
  },
  'circle-opacity': 0.8,
  'circle-radius': {
    property: 'population',
    type: 'exponential',
    stops: [
      [10, 2],
      [10000, 10]
    ]
  }
}

/**
 * TODO: Use icon?
 *
 * @see https://www.mapbox.com/maki-icons/
 */
const providerCircleStyle: MapboxGL.CirclePaint = {
  'circle-color': '#000',
  'circle-opacity': 0.6,
  'circle-radius': 5
}

const FIT_BOUNDS_OPTIONS = {
  padding: 20
}

type TableRowProps = {
  name: string
  value: number
}

const TableRow = ({ name, value }: TableRowProps) => (
  <tr>
    <td>{name}</td>
    <td style={{ paddingLeft: 15 }}>{value}</td>
  </tr>
)

function providerPopup(point: any) {
  console.log(point)
  /*
    TODO: expose info for all providers with the same address,
    not only the first one.
  */
  let pointProps = point.features[0].properties
  return (
    <div className='popup-container'>
      <Popup
        offset={[0, -20]}
        anchor='bottom'
        coordinates={point.lngLat} >
        <h2> Provider </h2>
        <table className='popup-table'>
          <tbody>
            <TableRow name='Address' value={pointProps.address} />
            <TableRow name='Specialty' value={pointProps.specialty} />
            <TableRow name='Lat' value={point.lngLat['lat'].toFixed(4)} />
            <TableRow name='Long' value={point.lngLat['lng'].toFixed(4)} />
          </tbody>
        </table>
      </Popup>
    </div>
  )
}

function representativePointPopup(point: any) {
  let pointProps = point.features[0].properties
  console.log(point)
  return (
    <div className='popup-container'>
      <Popup
        offset={[0, -20]}
        anchor='bottom'
        coordinates={point.lngLat} >
        <h2> Representative Point </h2>
        <table className='popup-table'>
          <tbody>
            <TableRow name='County' value={pointProps.county} />
            <TableRow name='ZIP' value={pointProps.zip} />
            <TableRow name='Population' value={pointProps.population} />
            <TableRow name='Lat' value={point.lngLat['lat'].toFixed(4)} />
            <TableRow name='Long' value={point.lngLat['lng'].toFixed(4)} />
          </tbody>
        </table>
      </Popup>
    </div>
  )
}

function removePopup(store: Store) {
  store.set('providerClicked')(null)
  store.set('representativePointClicked')(null)
}

export let MapView = withStore(
  'adequacies',
  'mapCenter',
  'mapZoom',
  'providers',
  'representativePoints',
  'providerClicked',
  'representativePointClicked'
)(({ store }) => {
  let adequacies = store.get('adequacies')
  let providers = store.get('providers')
  let representativePoints = store.get('representativePoints')
  let bounds = boundingBox(representativePoints)
  let shouldAutoAdjustMap = store.get('shouldAutoAdjustMap')
  let representativePointClicked = store.get('representativePointClicked')
  let providerClicked = store.get('providerClicked')

  // Don't auto-adjust on next render (manual pan/zoom, etc. rerender the map).
  if (shouldAutoAdjustMap) {
    store.set('shouldAutoAdjustMap')(false)
  }

  return <div className='MapView'>
    <Map
      fitBounds={bounds && shouldAutoAdjustMap
        ? new LngLatBounds(
          new LngLat(bounds.sw.lng, bounds.sw.lat),
          new LngLat(bounds.ne.lng, bounds.ne.lat)
        )
        : null}
      fitBoundsOptions={FIT_BOUNDS_OPTIONS}
      style='mapbox://styles/bayesimpact/cj8qeq6cpajqc2ts1xfw8rf2q'
      center={store.get('mapCenter')}
      onDragEnd={(map: MapboxGL.Map) => store.set('mapCenter')(map.getCenter())}
      onZoomEnd={(map: MapboxGL.Map) => store.set('mapZoom')(map.getZoom())}
      zoom={[store.get('mapZoom')]}
      onClick={() => removePopup(store)}
    >
      {representativePoints.length && <GeoJSONLayer
        id='representativePoints'
        data={representativePointsToGeoJSON(adequacies)(representativePoints)}
        circlePaint={representativePointCircleStyle}
        circleOnClick={(point: any) => store.set('representativePointClicked')(point)}
        circleOnMouseEnter={() => store.set('mapCursor')('pointer')}
        circleOnMouseLeave={() => store.set('mapCursor')('')}
      />}
      {providers.length && <GeoJSONLayer
        id='providers'
        data={providersToGeoJSON(providers)}
        circlePaint={providerCircleStyle}
        circleOnClick={(point: any) => store.set('providerClicked')(point)}
        circleOnMouseEnter={() => store.set('mapCursor')('pointer')}
        circleOnMouseLeave={() => store.set('mapCursor')('')}
      />}
      {representativePointClicked && representativePointPopup(representativePointClicked)}
      {providerClicked && providerPopup(providerClicked)}

      <ZoomControl position='bottomRight' style={{ bottom: 30, right: 19 }} />
      <ScaleControl measurement='mi' position='bottomRight' style={{ bottom: 30, right: 58 }} />
    </Map>
  </div>
})

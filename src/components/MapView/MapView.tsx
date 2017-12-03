import * as MapboxGL from 'mapbox-gl'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { Store, withStore } from '../../services/store'
import { boundingBox, providersToGeoJSON, representativePointsToGeoJSON } from '../../utils/geojson'
import { ProviderPopup, RepresentativePointPopup } from '../MapTooltip/MapTooltip'
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
  // TODO: instantiate React Components such as RepresentativePointPopup with JSX syntax.
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
      fitBoundsOptions={{
        padding: {
          bottom: 20,
          left: 404,
          right: 20,
          top: 20
        }
      }}
      style='mapbox://styles/bayesimpact/cj8qeq6cpajqc2ts1xfw8rf2q'
      center={store.get('mapCenter')}
      onDragEnd={(map: MapboxGL.Map) => store.set('mapCenter')(map.getCenter())}
      onZoomEnd={(map: MapboxGL.Map) => store.set('mapZoom')(map.getZoom())}
      zoom={[store.get('mapZoom')]}
      onClick={() => removePopup(store)}
    >
      {representativePoints.length && <GeoJSONLayer
        data={representativePointsToGeoJSON(adequacies)(representativePoints)}
        circlePaint={representativePointCircleStyle}
        circleOnClick={(point: any) => store.set('representativePointClicked')(point)}
      />}
      {providers.length && <GeoJSONLayer
        data={providersToGeoJSON(providers)}
        circlePaint={providerCircleStyle}
        circleOnClick={(point: any) => store.set('providerClicked')(point)}
      />}
      {representativePointClicked && RepresentativePointPopup(representativePointClicked)}
      {providerClicked && ProviderPopup(providerClicked)}

      <ZoomControl position='bottomRight' style={{ bottom: 30, right: 19 }} />
      <ScaleControl measurement='mi' position='bottomRight' style={{ bottom: 30, right: 58 }} />
    </Map>
  </div>
})

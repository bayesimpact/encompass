import * as MapboxGL from 'mapbox-gl'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { withStore } from '../../services/store'
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

export let MapView = withStore(
  'adequacies',
  'mapCenter',
  'mapZoom',
  'providers',
  'representativePoints'
)(({ store }) => {
  let adequacies = store.get('adequacies')
  let providers = store.get('providers')
  let representativePoints = store.get('representativePoints')
  let bounds = boundingBox(representativePoints)
  let shouldAutoAdjustMap = store.get('shouldAutoAdjustMap')

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
    >
      {representativePoints.length && <GeoJSONLayer
        data={representativePointsToGeoJSON(adequacies)(representativePoints)}
        circlePaint={representativePointCircleStyle}
      />}
      {providers.length && <GeoJSONLayer
        data={providersToGeoJSON(providers)}
        circlePaint={providerCircleStyle}
      />}
      <ZoomControl position='bottomRight' style={{ bottom: 30, right: 19 }} />
      <ScaleControl measurement='mi' position='bottomRight' style={{ bottom: 30, right: 58 }} />
    </Map>
  </div>
})

import * as MapboxGL from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { Store, withStore } from '../../services/store'
import { providersToGeoJSON, representativePointsToGeoJSON } from '../../utils/geojson'
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

// TODO: instantiate React Components such as RepresentativePointPopup with JSX syntax.
export let MapView = withStore(
  'adequacies',
  'mapCenter',
  'mapZoom',
  'providers',
  'providerClicked',
  'representativePointClicked'
)(({ store }) => {
  let adequacies = store.get('adequacies')
  let providers = store.get('providers')
  let representativePoints = store.get('representativePoints')
  let representativePointClicked = store.get('representativePointClicked')
  let providerClicked = store.get('providerClicked')

  return <div className='MapView'>
    <Map
      fitBoundsOptions={{
        padding: {
          bottom: 20,
          left: 404, // 320 + 64 + 20 <- TODO: Codegen from CSS
          right: 20,
          top: 20
        }
      }}
      style='mapbox://styles/bayesimpact/cj8qeq6cpajqc2ts1xfw8rf2q'
      center={store.get('mapCenter')}
      onDragEnd={(map: MapboxGL.Map) => store.set('mapCenter')(map.getCenter())}
      onRender={(map: MapboxGL.Map) => store.get('map') || store.set('map')(map)}
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

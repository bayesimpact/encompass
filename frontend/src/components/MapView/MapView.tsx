import * as MapboxGL from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { providersToGeoJSON, representativePointsToGeoJSON } from '../../utils/geojson'
import { MapLegend } from '../MapLegend/MapLegend'
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
    property: 'adequacyMode',
    type: 'categorical',
    stops: [
      [AdequacyMode.ADEQUATE_15, ADEQUACY_COLORS[AdequacyMode.ADEQUATE_15]],
      [AdequacyMode.ADEQUATE_30, ADEQUACY_COLORS[AdequacyMode.ADEQUATE_30]],
      [AdequacyMode.ADEQUATE_60, ADEQUACY_COLORS[AdequacyMode.ADEQUATE_60]],
      [AdequacyMode.INADEQUATE, ADEQUACY_COLORS[AdequacyMode.INADEQUATE]],
      [AdequacyMode.OUT_OF_SCOPE, ADEQUACY_COLORS[AdequacyMode.OUT_OF_SCOPE]],
      ['undefined', '#8eacbb']
    ]
  },
  'circle-opacity': 0.8,
  'circle-radius': {
    property: 'population',
    type: 'exponential',
    // minPopulation, maxPopulation = 10, 10000
    // minRadius, maxRadius = 4, 10
    stops: [
      [10, 4],
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
  store.set('selectedProvider')(null)
  store.set('selectedRepresentativePoint')(null)
}

const FIT_BOUNDS_OPTIONS = {
  padding: {
    bottom: 20,
    left: 404, // 320 + 64 + 20 <- TODO: Codegen from CSS
    right: 20,
    top: 20
  }
}
const SCALE_CONTROL_STYLE = { bottom: 30, right: 58 }
const ZOOM_CONTROL_STYLE = { bottom: 30, right: 19 }

export let MapView = withStore(
  'adequacies',
  'mapCenter',
  'mapZoom',
  'providers',
  'selectedProvider',
  'selectedRepresentativePoint'
)(({ store }) => {
  let adequacies = store.get('adequacies')
  let providers = store.get('providers')
  let representativePoints = store.get('representativePoints')
  let selectedRepresentativePoint = store.get('selectedRepresentativePoint')
  let selectedProvider = store.get('selectedProvider')

  return <div className='MapView'>
    <Map
      fitBoundsOptions={FIT_BOUNDS_OPTIONS}
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
        circleOnClick={store.set('selectedRepresentativePoint')}
      />}
      {providers.length && <GeoJSONLayer
        data={providersToGeoJSON(providers)}
        circlePaint={providerCircleStyle}
        circleOnClick={store.set('selectedProvider')}
      />}
      {selectedRepresentativePoint && <RepresentativePointPopup point={selectedRepresentativePoint} />}
      {selectedProvider && <ProviderPopup point={selectedProvider} />}

      <ZoomControl position='bottomRight' style={ZOOM_CONTROL_STYLE} />
      <ScaleControl measurement='mi' position='bottomRight' style={SCALE_CONTROL_STYLE} />
    </Map>
    <MapLegend />
  </div>
})
MapView.displayName = 'MapView'

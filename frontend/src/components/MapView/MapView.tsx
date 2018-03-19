import { FeatureCollection, GeometryObject } from 'geojson'
import * as MapboxGL from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { providersToGeoJSON } from '../../utils/geojson'
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
      [AdequacyMode.ADEQUATE_0, ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0]],
      [AdequacyMode.ADEQUATE_1, ADEQUACY_COLORS[AdequacyMode.ADEQUATE_1]],
      [AdequacyMode.ADEQUATE_2, ADEQUACY_COLORS[AdequacyMode.ADEQUATE_2]],
      [AdequacyMode.INADEQUATE, ADEQUACY_COLORS[AdequacyMode.INADEQUATE]],
      [AdequacyMode.OUT_OF_SCOPE, ADEQUACY_COLORS[AdequacyMode.OUT_OF_SCOPE]],
      ['undefined', '#8eacbb']
    ]
  },
  'circle-opacity': 0.8,
  'circle-radius': {
    property: 'population',
    type: 'exponential',
    // stops are [population, point radius] pairs.
    stops: [
      [1, 1.6],
      [100, 3.2],
      [1000, 4.8],
      [10000, 9.6]
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
  store.set('providerIndex')(0)
}

const SCALE_CONTROL_STYLE = { bottom: 30, right: 58 }
const ZOOM_CONTROL_STYLE = { bottom: 30, right: 19 }

export let MapView = withStore(
  'pointFeatureCollections',
  'mapCenter',
  'providerIndex',
  'providers',
  'selectedProvider',
  'selectedRepresentativePoint'
)(({ store }) => {
  let providers = store.get('providers')
  let selectedRepresentativePoint = store.get('selectedRepresentativePoint')
  let selectedProvider = store.get('selectedProvider')
  const pointFeatureCollections = store.get('pointFeatureCollections')

  return <div className='MapView'>
    <Map
      style='mapbox://styles/bayesimpact/cj8qeq6cpajqc2ts1xfw8rf2q'
      center={store.get('mapCenter')}
      zoom={store.get('mapZoom')}
      onRender={(map: MapboxGL.Map) => store.get('map') || store.set('map')(map)}
      onClick={() => removePopup(store)}
    >
      {pointFeatureCollections && pointFeatureCollections.map(pointGeoJson => getRepresentativePointLayer(pointGeoJson, store))}

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

function getRepresentativePointLayer(pointGeoJSON: FeatureCollection<GeometryObject>, store: Store) {
  return <GeoJSONLayer
    data={pointGeoJSON}
    circlePaint={representativePointCircleStyle}
    circleOnClick={store.set('selectedRepresentativePoint')}
  />
}

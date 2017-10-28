import * as MapboxGL from 'mapbox-gl'
import * as React from 'react'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'
import { withStore } from '../../services/store'
import './MapView.css'

const CENTER_OF_CALIFORNIA = [-122.444687, 37.765134] // [-119.182111, 36.250471]
const { MAPBOX_TOKEN } = process.env

if (!MAPBOX_TOKEN) {
  throw 'Please define MAPBOX_TOKEN env var'
}

let Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
})

const circleLayout: MapboxGL.CircleLayout = {
  visibility: 'visible'
}

const circlePaint: MapboxGL.CirclePaint = {
  'circle-color': '#8eacbb',
  'circle-opacity': 0.8,
  'circle-radius': {
    property: 'population',
    type: 'exponential',
    stops: [
      [100, 2],
      [100000, 10]
    ]
  }
}

export let MapView = withStore('representativePoints')(({ store }) => {
  let representativePoints = store.get('representativePoints')
  return <div className='MapView'>
    <Map
      style='mapbox://styles/bayesimpact/cj8qeq6cpajqc2ts1xfw8rf2q'
      center={CENTER_OF_CALIFORNIA}
      zoom={[12]}
    >
      {representativePoints && <GeoJSONLayer data={representativePoints}
        circlePaint={circlePaint} />}
      <ZoomControl position='bottomLeft' />
      <ScaleControl measurement='mi' position='bottomLeft' style={{ left: 48 }} />
    </Map>
  </div>
})

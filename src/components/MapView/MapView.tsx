import * as React from 'react'
import ReactMapboxGl, { ScaleControl, ZoomControl } from 'react-mapbox-gl'
import './MapView.css'

const CENTER_OF_CALIFORNIA = [-119.182111, 36.250471]
const { MAPBOX_TOKEN } = process.env

if (!MAPBOX_TOKEN) {
  throw 'Please define MAPBOX_TOKEN env var'
}

let Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
})

export let MapView = () =>
  <div className='MapView'>
    <Map
      style='mapbox://styles/bayesimpact/cj8qeq6cpajqc2ts1xfw8rf2q'
      center={CENTER_OF_CALIFORNIA}
      zoom={[5]}
    >
      <ZoomControl position='bottomLeft' />
      <ScaleControl measurement='mi' position='bottomLeft' style={{ left: 48 }} />
    </Map>
  </div>

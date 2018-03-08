import * as React from 'react'
import { render } from 'react-dom'
import * as ReactGA from 'react-ga'
import { App } from './components/App/App'
import { getGoogleAnalyticsAppId } from './utils/env'

// Set up Google Analytics.
const googleAnalyticsAppId = getGoogleAnalyticsAppId()
console.log('Initializing Google Analytics with app ID: ' + googleAnalyticsAppId)
ReactGA.initialize(googleAnalyticsAppId)
ReactGA.pageview(window.location.pathname + window.location.search)

render(<App />, document.querySelector('#App'))

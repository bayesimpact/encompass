import * as React from 'react'
import { render } from 'react-dom'
import * as ReactGA from 'react-ga'
import { App } from './components/App/App'
import { getGoogleAnalyticsAppId } from './utils/env'

// Set up Google Analytics.
ReactGA.initialize(getGoogleAnalyticsAppId())
ReactGA.pageview(window.location.pathname + window.location.search)

render(<App />, document.querySelector('#App'))

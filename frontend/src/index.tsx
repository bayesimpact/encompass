import * as React from 'react'
import { render } from 'react-dom'
import ReactGA from 'react-ga';
import { App } from './components/App/App'

ReactGA.initialize('UA-115165680-1');
ReactGA.pageview(window.location.pathname + window.location.search);
render(<App />, document.querySelector('#App'))

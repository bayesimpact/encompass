import * as React from 'react'
import { render } from 'react-dom'
import { App } from './components/App/App'
import { store } from './services/store'

render(<App store={store} />, document.querySelector('#App'))

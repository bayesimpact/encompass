// import * as fs from 'fs'
import { Config } from '../constants/datatypes'

export let CONFIG: Config

// tslint:disable:no-var-requires
CONFIG = require('../../../shared/config.json')
if (process.env.ENV !== undefined) {
    CONFIG.title_suffix = (process.env.ENV !== 'PRD' ? ' - ' + process.env.ENV : '')
}

CONFIG.api.backend_root = process.env.API_ROOT || CONFIG.api.backend_root

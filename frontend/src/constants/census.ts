/**
 * This file was automatically generated.
 * DO NOT MODIFY IT BY HAND. Instead, run "yarn codegen" to regenerate it.
 */
import { CONFIG } from '../config/config'

type censusMapping = {
  [category: string]: string[]
}

export const CENSUS_MAPPING_ERROR = 'No Census Mapping Detected'

export let CENSUS_MAPPING: censusMapping = {
  age: [
    '0-18 years',
    '19-25 years',
    '26-34 years',
    '35-54 years',
    '55-64 years',
    '65+ years'
  ],
  sex: ['Male', 'Female'],
  race: [
    'Hispanic or Latino (any race)',
    'White',
    'Black',
    'American Indian & Alaska Native',
    'Asian',
    'Native Hawaiian & other Pacific Islander',
    'Multiracial or Other'
  ],
  insurance: [
    'Private Health Insurance',
    'Public Health Insurance',
    'No Health Insurance'
  ],
  income: [
    '$0 - $15k',
    '$15k - $50k',
    '$50k - $100k',
    '$100k - $150k',
    '$150k - $200k',
    '$200k+'
  ]
}

if (!CONFIG.is_census_data_available) {
  CENSUS_MAPPING = { unvailable: [] }
}

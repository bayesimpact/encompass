/**
 * This file was automatically generated.
 * DO NOT MODIFY IT BY HAND. Instead, run "yarn codegen" to regenerate it.
 */

type censusMapping = {
  [category: string]: string[]
}

export const CENSUS_MAPPING_ERROR = 'No Census Mapping Detected'

export const CENSUS_MAPPING: censusMapping = {
  age: [
    '0-18 Years',
    '19-25 Years',
    '26-34 Years',
    '35-54 Years',
    '55-64 Years',
    '65+ Years'
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
    '< $15k',
    '$15k - $50k',
    '$50k - $100k',
    '$100k - $150k',
    '$150k - $200k',
    '> $200k'
  ]
}

/**
 * Codegens API typings
 */
import Axios from 'axios'
import { readFileSync } from 'fs'
import { compileFromFile, Options } from 'json-schema-to-typescript'
import { chain } from 'lodash'
import { mkdir, writeFile } from 'mz/fs'
import { format, Options as PrettierOptions } from 'prettier'
import rmrf = require('rmfr')
import { inspect } from 'util'
import { GetAvailableServiceAreasResponse } from '../src/constants/api/available-service-areas-response'

const PRETTIER_OPTIONS: PrettierOptions = {
  semi: false,
  singleQuote: true
}

const OPTIONS: Partial<Options> = {
  style: PRETTIER_OPTIONS
}

main()

async function main() {

  console.info('Running codegen...')

  console.info('[Step 1] Codegen API request/response types')
  await codegenAPITypes()

  console.info('[Step 2] Codegen ZIP codes')
  await codegenZIPCodes()

  console.info('[Step 3] Census Category Mapping')
  await codegenCensusMapping()
}

async function codegenZIPCodes() {
  let r = await Axios.get('http://localhost:8080/api/available-service-areas/')
  if (r.status !== 200) {
    throw 'Error GETting http://localhost:8080/api/available-service-areas/. Is the server running?'
  }

  type ZipsByCountyByState = Record<string, {
    [county: string]: { zip_codes: string[], nhcs_code: number }
  }>

  let data: GetAvailableServiceAreasResponse = r.data
  let zipsByCountyByState = chain(data)
    .reduce<GetAvailableServiceAreasResponse[0], ZipsByCountyByState>((acc, [_a, c, z, s, r]) => {
      if (!acc[s]) {
        acc[s] = {}
      }
      if (!acc[s][c]) {
        acc[s][c] = { zip_codes: [], nhcs_code: parseFloat(r) }
      }
      acc[s][c].zip_codes.push(z)
      return acc
    }, {})
    .mapKeys((_v, k) => k.toLowerCase())
    .value()

  await writeFile(`src/constants/zipCodesByCountyByState.ts`, format(
    genZipsByCountyByState(zipsByCountyByState), {
      parser: 'typescript',
      printWidth: 10000,
      ...PRETTIER_OPTIONS
    })
  )
  console.info(`  Wrote ${data.length} zips to src/constants/zipCodesByCountyByState.ts`)
}

async function codegenAPITypes() {
  await rmrf('src/constants/api/')
  console.info('  Removed folder src/constants/api/')

  await mkdir('src/constants/api/')
  console.info('  Created folder src/constants/api/')

  // TODO compile from schema for every file in this subdir, without explicitly listing here.
  await Promise.all([
    compileJSONSchema('adequacies-request'),
    compileJSONSchema('adequacies-response'),
    compileJSONSchema('available-service-areas-response'),
    compileJSONSchema('census-data-response'),
    compileJSONSchema('geocode-request'),
    compileJSONSchema('geocode-response'),
    compileJSONSchema('representative-points-request'),
    compileJSONSchema('representative-points-response')
  ])
  console.info('  Compiled 7 JSON-Schemas to src/constants/api')
}

async function compileJSONSchema(filename: string) {
  let ts = await compileFromFile(`../shared/api-spec/${filename}.json`, OPTIONS)
  await writeFile(`src/constants/api/${filename}.ts`, ts)
}

function genZipsByCountyByState(object: object) {
  return `/**
* This file was automatically generated.
* DO NOT MODIFY IT BY HAND. Instead, run "yarn codegen" to regenerate it.
*/

import { State } from './states'

export const ZIPS_BY_COUNTY_BY_STATE: Record<State, {
  [county: string]: { zip_codes: string[], nhcs_code: number }
}> = ${inspect(object, { breakLength: Infinity, depth: null, maxArrayLength: null })}
`
}

function genCensusMapping(object: object) {
  return `/**
* This file was automatically generated.
* DO NOT MODIFY IT BY HAND. Instead, run "yarn codegen" to regenerate it.
*/
import { CONFIG } from '../config/config'

type censusMapping = {
  [category: string]: string[]
}

export const CENSUS_MAPPING_ERROR = 'No Census Mapping Detected'

export let CENSUS_MAPPING: censusMapping = ${inspect(object, { breakLength: Infinity, depth: null, maxArrayLength: null })}

if (!CONFIG.is_census_data_available) {
  CENSUS_MAPPING = { unvailable: [] }
}
`
}

interface ParsedMapping {
  [category: string]: string[]
}

async function codegenCensusMapping() {
  await rmrf('src/constants/census.ts')
  console.info('  Removed file src/constants/census.ts')

  let censusMapping = JSON.parse(readFileSync('../shared/census_mapping.json', 'utf8'))
  console.info('  Updated census mapping with:')
  // FIXME - Revise function and simplify.
  let parsedMapping: ParsedMapping = {}
  for (let categoryKey in censusMapping) {
    let category = censusMapping[categoryKey]
    let groups: string[] = []
    for (let groupKey in category) {
      groups.push(category[groupKey].human_readable_name)
    }
    parsedMapping[categoryKey] = groups
  }
  console.info(parsedMapping)
  await writeFile('src/constants/census.ts', format(
    genCensusMapping(parsedMapping), {
      parser: 'typescript',
      ...PRETTIER_OPTIONS
    })
  )
}

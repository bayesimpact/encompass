/**
 * Codegens API typings
 */

import Axios from 'axios'
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
}

async function codegenZIPCodes() {
  let r = await Axios.get('http://localhost:8080/api/available-service-areas/')
  if (r.status !== 200) {
    throw 'Error GETting http://localhost:8080/api/available-service-areas/. Is the server running?'
  }

  type ZipsByCountyByState = Record<string, {
    [county: string]: string[]
  }>

  let data: GetAvailableServiceAreasResponse = r.data
  let zipsByCountyByState = chain(data)
    .reduce<GetAvailableServiceAreasResponse[0], ZipsByCountyByState>((acc, [_a, c, z, s]) => {
      if (!acc[s]) {
        acc[s] = {}
      }
      if (!acc[s][c]) {
        acc[s][c] = []
      }
      acc[s][c].push(z)
      return acc
    }, {})
    .mapKeys((_v, k) => k.toLowerCase())
    .value()

  await writeFile(`src/constants/zipsByCountyByStateCode.ts`, format(
    genZipsByCountyByState(zipsByCountyByState), {
      parser: 'typescript',
      ...PRETTIER_OPTIONS
    })
  )
  console.info(`  Wrote ${data.length} zips to src/constants/zipsByCountyByStateCode.ts`)
}

async function codegenAPITypes() {
  await rmrf('src/constants/api/')
  console.info('  Removed folder src/constants/api/')

  await mkdir('src/constants/api/')
  console.info('  Created folder src/constants/api/')

  await Promise.all([
    compileJSONSchema('adequacies-request'),
    compileJSONSchema('adequacies-response'),
    compileJSONSchema('available-service-areas-response'),
    compileJSONSchema('providers-request'),
    compileJSONSchema('providers-response'),
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
  [county: string]: string[]
}> = ${inspect(object, { breakLength: Infinity, depth: null, maxArrayLength: null })}
`
}

/**
 * Codegens API typings
 */

import { compileFromFile, Options } from 'json-schema-to-typescript'
import { mkdir, writeFile } from 'mz/fs'
import rmrf = require('rmfr')

const OPTIONS: Partial<Options> = {
  style: {
    semi: false,
    singleQuote: true
  }
}

async function compileJSONSchema(filename: string) {
  let ts = await compileFromFile(`../shared/api-spec/${filename}.json`, OPTIONS)
  await writeFile(`src/constants/api/${filename}.ts`, ts)
}

async function main() {

  console.info('Running codegen...')

  console.info('[Step 1] Codegen API request/response types')

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

main()

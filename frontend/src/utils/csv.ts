import { chain } from 'lodash'
import { parse as papaparse, unparse } from 'papaparse'

export function parseCSV<T>(csvFile: File): Promise<T[]> {
  return new Promise((resolve, reject) =>
    papaparse(csvFile, {
      complete({ data }) {
        resolve(data)
      },
      skipEmptyLines: true,
      error: reject
    })
  )
}

export type ColumnDefinition = {
  aliases: string[]
  required?: boolean
}

function safeLowerCase(string: string | undefined) {
  if (string === undefined) {
    return ''
  }
  return string.toLocaleLowerCase()
}

type ValidateHeaders = (columns: ColumnDefinition[], fields: string[]) => ParseError[]

let validateHeadersDefault: ValidateHeaders = (columns, fields) =>
  chain(columns)
    .map((c, n) => {
      if (c.required && fields.findIndex(_ => c.aliases.some(a => a.toLowerCase() === safeLowerCase(_))) < 0) {
        return new ParseError(0, n, c, `Missing column "${c.aliases[0]}."`)
      }
      return undefined
    })
    .filter(Boolean)
    .value()

export function parseRows<T, Context extends object>(
  columns: ColumnDefinition[],
  f: (fields: (string | null)[], rowIndex: number, context: Context) => ParseError | T,
  validateHeaders: ValidateHeaders = validateHeadersDefault
) {
  return async (file: File, context?: Context): Promise<[ParseError[], T[]]> => {
    let csv = await parseCSV<string[]>(file)
    let columnIndices = findColumns(columns, csv)

    // Header parse errors are fatal. If header validation fails, return early.
    let errors = validateHeaders(columns, columnIndices.map(_ => csv[0][_]))
    if (errors.length) {
      return [errors, []]
    }

    return chain(csv)
      .slice(1)         // Ignore header row
      .filter(Boolean)  // Ignore empty rows (whitespace)
      .map((row, rowIndex) => {
        let fields = readRow(row, columnIndices)

        // Check that fields aren't empty.
        let error = getEmptyError(columns, fields, rowIndex)
        if (error) {
          return error
        }

        // Try to parse.
        return f(fields, rowIndex, context || {} as any) // TODO

      })
      .partition(_ => _ instanceof ParseError)
      .value() as [ParseError[], T[]]
  }
}

/**
 * TODO: Is there a more elegant way to implement this?
 */
function getEmptyError(
  columns: ColumnDefinition[],
  fields: (string | null)[],
  rowIndex: number
) {
  for (let i = 0; i < columns.length; i++) {
    let { required } = columns[i]
    let field = fields[i]
    // TODO: Why is field sometimes undefined?
    if (required && isEmpty(field)) {
      return new ParseError(rowIndex, i, columns[i], 'Expected a value, but the field is empty.')
    }
  }
}

/**
 * Returns whether or not the given CSV field is empty.
 */
export function isEmpty(a: string | null | undefined) {
  return a == null || a.trim() === ''
}

/**
 * Finds indices of the given columns in the given CSV.
 *
 * TODO: Fuzzy matching for column names
 */
function findColumns(columns: ColumnDefinition[], csv: string[][]) {
  return columns.map(({ aliases }) =>
    csv[0].findIndex(_ => aliases.some(a => a.toLowerCase() === _.toLowerCase()))
  )
}

function readRow(csvRow: string[], columnIndices: number[]) {
  return columnIndices.map(index => {
    if (index < 0) {
      return null
    }
    return csvRow[index]
  })
}

export function generateCSV(headers: string[], data: (string | number)[][]) {
  return unparse({ fields: headers, data })
}

export class ParseError {
  constructor(
    public rowIndex: number,
    public columnIndex: number,
    public column: ColumnDefinition,
    public message: string
  ) { }
  toString() {
    return `Error at row ${this.rowIndex} for field ${this.column.aliases[0]}: ${this.message}`
  }
}

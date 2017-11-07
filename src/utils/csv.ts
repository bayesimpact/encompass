import { chain, noop } from 'lodash'
import { parse as papaparse } from 'papaparse'

export function parseCSV<T>(csvFile: File): Promise<T[]> {
  return new Promise((resolve, reject) =>
    papaparse(csvFile, {
      complete({ data }) {
        resolve(data)
      },
      error: reject
    })
  )
}

export type ColumnDefinition = {
  aliases: string[]
  required?: boolean
}

type ValidateHeaders = (columns: ColumnDefinition[], fields: string[]) => ParseError[]

let validateHeadersDefault: ValidateHeaders = (columns, fields) =>
  chain(columns)
    .map((c, n) => {
      if (c.required && fields.findIndex(_ => c.aliases.some(a => a === _)) < 0) {
        return new ParseError(0, n, c, `CSV must define column "${c.aliases[0]}"`)
      }
      return undefined
    })
    .filter(Boolean)
    .value()

export function parseRows<T>(
  columns: ColumnDefinition[],
  f: (fields: (string | null)[], rowIndex: number) => ParseError | T,
  validateHeaders: ValidateHeaders = validateHeadersDefault
) {
  return async (file: File): Promise<[ParseError[], T[]]> => {
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
        return f(fields, rowIndex)

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
      return new ParseError(rowIndex, i, columns[i], 'Expected a value, but the field is empty')
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
    csv[0].findIndex(_ => aliases.some(a => a === _))
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

export class ParseError {
  constructor(
    public rowIndex: number,
    public columnIndex: number,
    public column: ColumnDefinition,
    public message: string
  ) { }
  toString() {
    return `CSV Parse Error at row ${this.rowIndex} field ${this.columnIndex} (${this.column.aliases[0]}): ${this.message}`
  }
}

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

type ValidateHeaders = (columns: ColumnDefinition[], fields: string[]) => Error[]

let validateHeadersDefault: ValidateHeaders = (columns, fields) =>
  chain(columns)
    .filter(c => c.required && fields.findIndex(_ => c.aliases.some(a => a === _)) < 0)
    .map(_ => Error(`CSV must define column "${_.aliases[0]}"`))
    .value()

export function parseRows<T>(
  columns: ColumnDefinition[],
  f: (fields: (string | null)[]) => T,
  validateHeaders: ValidateHeaders = validateHeadersDefault
) {
  return async (file: File): Promise<[ParseError[], T[]]> => {
    let csv = await parseCSV<string[]>(file)
    let columnIndices = findColumns(columns, csv)

    // TODO: Expose errors to user.
    validateHeaders(columns, columnIndices.map(_ => csv[0][_]))
      .forEach(e => { throw e })

    return chain(csv)
      .slice(1)         // Ignore header row
      .filter(Boolean)  // Ignore empty rows (whitespace)
      .map((row, index) => {
        let fields = readRow(row, columnIndices)
        return getError(columns, fields, index) || f(fields)
      })
      .partition(_ => _ instanceof ParseError)
      .value() as [ParseError[], T[]]
  }
}

/**
 * TODO: Is there a more elegant way to implement this?
 */
function getError(
  columns: ColumnDefinition[],
  fields: (string | null)[],
  rowIndex: number
) {
  for (let i = 0; i < columns.length; i++) {
    let { required } = columns[i]
    let field = fields[i]
    // TODO: Why is field sometimes undefined?
    if (required && isEmpty(field)) {
      return new ParseError(rowIndex, i, columns[i], fields)
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
    public fields: (string | null)[]
  ) { }
  toString() {
    // TODO: Customizable error message
    return `Error at row ${this.rowIndex} field ${this.columnIndex} (${this.column.aliases[0]}): Expected a value, but the field is empty. Row="${this.fields}"`
  }
}

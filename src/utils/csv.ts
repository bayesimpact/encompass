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

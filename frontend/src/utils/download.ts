/**
 * Download a file that was generated on the client.
 *
 * @see https://github.com/mholt/PapaParse/issues/175#issuecomment-201308792
 *
 * TODO: Move this to its own module.
 */
export function download(contents: string, mimeType: string, filename: string) {
  let csvData = new Blob([contents], { type: `${mimeType};charset=utf-8;` })
  if (navigator.msSaveBlob) {
    // IE11 & Edge
    navigator.msSaveBlob(csvData, filename)
  } else {
    // In FF link must be added to DOM to be clicked
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(csvData)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

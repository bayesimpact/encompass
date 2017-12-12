import { Store } from '../../services/store'
import { parseServiceAreasCSV } from './ServiceAreasDrawer'

/**
 * TODO: Read these CSVs from test/mock instead.
 */

let pointAsCountyOnly = new File([`CountyName
San Diego
san francisco
`], 'pointAsCountyOnly.csv')

let pointAsDuplicateCountyOnly = new File([`county,zip
sanFrancisco,
sanFrancisco,
`], 'pointAsDuplicateCountyOnly.csv')

let pointAsInvalidInputFile = new File([`City\8x8
Vista\asdqw\qwewq\asdas, wqei, wqeoiwq
san Francisco
`], 'pointAsInvalidInputFile.csv')

let pointAsInvalidInputFile2 = new File([`CountyName,City,ZipCode,PopulationPointsPerZipCode
San Diego,Vista,92084,100
Fake County,Berkeley,94505,1001
`], 'pointAsInvalidInputFile2.csv')

let pointAsInvalidInputFile3 = new File([`CountyName,City,ZipCode,PopulationPointsPerZipCode
San Diego,Vista,92084,100
Alameda,Berkeley,12345,1001
`], 'pointAsInvalidInputFile3.csv')

let pointAsInvalidInputFile4 = new File([`CountyName,City,ZipCode,PopulationPointsPerZipCode
San Diego,Vista,92084,100
Alameda,Berkeley,   ,1001
`], 'pointAsInvalidInputFile4.csv')

let pointAsZipAndCounty = new File([`CountyName,City,ZipCode,PopulationPointsPerZipCode
San Diego,Vista,92084,100
san francisco,san Francisco,94117,1001
`], 'pointAsZipAndCounty.csv')

let pointAsZipOnly = new File([`ZipCode
94117
94103
94102
94110
94114
92154
91935
92055
`], 'pointAsZipOnly.csv')

// TODO: More complete mock
let mockStore: Store = {
  get() {
    return {
      state: 'ca'
    }
  }
} as any

test('parseServiceAreasCSV (county only)', async () =>
  expect(await parseServiceAreasCSV(mockStore)(pointAsCountyOnly)).toMatchSnapshot()
)

test('parseServiceAreasCSV (duplicate counties)', async () =>
  expect(await parseServiceAreasCSV(mockStore)(pointAsDuplicateCountyOnly)).toMatchSnapshot()
)

test('parseServiceAreasCSV (invalid input: missing column header)', async () =>
  expect((await parseServiceAreasCSV(mockStore)(pointAsInvalidInputFile))[0][0].toString()).toMatchSnapshot()
)

test('parseServiceAreasCSV (invalid input: invalid county name)', async () =>
  expect((await parseServiceAreasCSV(mockStore)(pointAsInvalidInputFile2))[0][0].toString()).toMatchSnapshot()
)

test('parseServiceAreasCSV (invalid input: zip not in county)', async () =>
  expect((await parseServiceAreasCSV(mockStore)(pointAsInvalidInputFile3))[0][0].toString()).toMatchSnapshot()
)

test('parseServiceAreasCSV (invalid input: missing zip)', async () =>
  expect((await parseServiceAreasCSV(mockStore)(pointAsInvalidInputFile4))[0][0].toString()).toMatchSnapshot()
)

test('parseServiceAreasCSV (zip and county)', async () =>
  expect(await parseServiceAreasCSV(mockStore)(pointAsZipAndCounty)).toMatchSnapshot()
)

test('parseServiceAreasCSV (zip only)', async () =>
  expect(await parseServiceAreasCSV(mockStore)(pointAsZipOnly)).toMatchSnapshot()
)

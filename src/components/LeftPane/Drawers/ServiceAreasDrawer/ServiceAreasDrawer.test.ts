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

test('parseServiceAreasCSV (county only)', async () =>
  expect(await parseServiceAreasCSV(pointAsCountyOnly)).toMatchSnapshot()
)

test('parseServiceAreasCSV (duplicate counties)', async () =>
  expect(await parseServiceAreasCSV(pointAsDuplicateCountyOnly)).toMatchSnapshot()
)

test('parseServiceAreasCSV (invalid input)', async () =>
  expect((await parseServiceAreasCSV(pointAsInvalidInputFile))[0][0].toString()).toMatchSnapshot()
)

test('parseServiceAreasCSV (zip and county)', async () =>
  expect(await parseServiceAreasCSV(pointAsZipAndCounty)).toMatchSnapshot()
)

test('parseServiceAreasCSV (zip only)', async () =>
  expect(await parseServiceAreasCSV(pointAsZipOnly)).toMatchSnapshot()
)

import { formatCoordinate } from '../../utils/formatters'
import { Popup } from 'react-mapbox-gl'
import * as React from 'react'

type TableRowProps = {
  name: string
  value: string
}

const TableRow = ({ name, value }: TableRowProps) => (
  <tr>
    <td>{name}</td>
    <td className='table-value'> {value}</td>
  </tr>
)

export function ProviderPopup(point: any) {
  /**
   * TODO: expose info for all providers with the same address,
   * not only the first one.
   */
  let pointProps = point.features[0].properties
  return (
    <div className='popup-container'>
      <Popup
        offset={[0, -20]}
        anchor='bottom'
        coordinates={point.lngLat} >
        <table className='popup-table'>
          <tbody>
            <TableRow name='Address' value={pointProps.address} />
            <TableRow name='Specialty' value={pointProps.specialty} />
            <TableRow name='Lat' value={formatCoordinate(point.lngLat.lat)} />
            <TableRow name='Long' value={formatCoordinate(point.lngLat.lng)} />
          </tbody>
        </table>
      </Popup>
    </div>
  )
}

export function RepresentativePointPopup(point: any) {
  let pointProps = point.features[0].properties
  return (
    <div className='popup-container'>
      <Popup
        offset={[0, -20]}
        anchor='bottom'
        coordinates={point.lngLat} >
        <table className='popup-table'>
          <tbody>
            <TableRow name='County' value={pointProps.county} />
            <TableRow name='ZIP' value={pointProps.zip} />
            <TableRow name='Population' value={pointProps.population} />
            <TableRow name='Lat' value={formatCoordinate(point.lngLat.lat)} />
            <TableRow name='Long' value={formatCoordinate(point.lngLat.lng)} />
          </tbody>
        </table>
      </Popup>
    </div>
  )
}

// type Props = {
//   content: React.ComponentClass
//   coordinates: [number, number]
// }

// let MapTooltip: React.StatelessComponent<Props> = ({ content, coordinates }) =>
//   <div className='popup-container'>
//     <Popup coordinates={latLng} ...>
//        { content }
//     </Popup>
//   </div>

//   type RepresentativePointPopupProps = {..}

//   let RepresentativePointPopup: React.StatelessComponent<RepresentativePointPopupProps> = ({ point }) =>
//     <MapTooltip
//       coordinates={point.lngLat}
//       content={
//         <table className='popup-table'>
//           ...
//         </table>
//       }
//     />

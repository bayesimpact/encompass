import * as React from 'react'
import * as ReactGA from 'react-ga'
import './TilePicker.css'

export type Tile<T> = {
  color: string
  description: string
  data: T
  name: string | JSX.Element
}

type Props<T> = {
  onChange(tile: Tile<T>): void
  tiles: Tile<T>[]
  value: Tile<T> | null
}

export function TilePicker<T>() {
  return class TilePicker extends React.Component<Props<T>> {
    render() {
      return <ul className='TilePicker'>
        {this.props.tiles.map(tile =>
          <li
            className={'Tile' + (tile === this.props.value ? ' -Active' : '')}
            key={typeof tile.name === 'string' ? tile.name : tile.name.toString()}
            onClick={() => {
              // We need to do a check here, because the tile for uploading a custom dataset doesn't have a stringy name attribute.
              let eventLabel = typeof tile.name === 'string' ? tile.name : 'Analyze Your Own Data'
              ReactGA.event({
                category: 'Dataset',
                action: 'Selected a dataset',
                label: eventLabel
              })
              this.props.onChange(tile)
            }}
          >
            <h2 style={{ backgroundColor: tile.color }}>{tile.name}</h2>
            <p>{tile.description}</p>
          </li>
        )}
      </ul>
    }
  }
}

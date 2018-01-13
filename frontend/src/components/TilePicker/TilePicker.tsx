import * as React from 'react'
import './TilePicker.css'

export type Tile<T> = {
  color: string
  description: string
  data: T
  name: string
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
            key={tile.name}
            onClick={() => this.props.onChange(tile)}
          >
            <h2 style={{ backgroundColor: tile.color }}>{tile.name}</h2>
            <p>{tile.description}</p>
          </li>
        )}
      </ul>
    }
  }
}

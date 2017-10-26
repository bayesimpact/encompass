import { Emitter } from 'typed-rx-emitter'

// TODO: pull out into its own repo

type Reduxify<Actions extends object> = {
  [K in keyof Actions]: {
    previousValue: Actions[K],
    value: Actions[K]
  }
}

class Store<Actions extends object> extends Emitter<Actions> {
  constructor(private state: Actions) {
    super()

    let emitter = new Emitter<Actions>()

    for (let key in state) {
      emitter.on(key).subscribe(value => {
        let previousValue = state[key]
        state[key] = value
        this.emit(key, { previousValue, value })
      })
    }
  }
  get<K extends keyof Actions>(key: K) {
    return this.state[key]
  }
  set<K extends keyof Actions>(key: K, value: Actions[K]) {
    return this.emit(key, value)
  }
}

export function createStore<Actions extends object>(
  initialState: Actions
): Store<Reduxify<Actions>> {
  return new Store<Actions>(initialState)
}

/////////////////////// react connector

import * as React from 'react'

type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] }
type Overwrite<T, U> = { [P in Diff<keyof T, keyof U>]: T[P] } & U

export function connect<Actions extends object>(store: Store<Actions>) {
  return function <Props extends { store: Store<Actions> }>(
    Component: React.ComponentType<Props>
  ): React.StatelessComponent<Omit<Props, 'store'>> {
  return ((props: Props) => <Component {...props} store={store} />) as any
  }
}

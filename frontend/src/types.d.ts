/**
 * TODO: Add typings and publish to DefinitelyTyped.
 */

declare module 'chart.piecelabel.js'

<<<<<<< HEAD
declare module 'esri-extent' {
  namespace esriExtent {
    type Extent = {
      xmin: number
      ymin: number
      xmax: number
      ymax: number
      spatialReference: {
        wkid: number
        latestWkid: number
      }
    }
  }
  function esriExtent(json: object): esriExtent.Extent
  export = esriExtent
}

=======
>>>>>>> 7527cbd... Rebase to master
declare module 'mui-icons/cmdi/*'

declare module 'react-autocomplete'

declare module 'rmfr' {
  function rmfr(path: string): Promise<void>
  export = rmfr
}

/**
 * Globals
 */

/**
 * `_.chain(..)` gives a value of type `_.LoDashExplicitWrapper`. `chain` is
 * convenient because it lets us defer computations over collections and reap
 * the performance benefits of Lodash's loop fusion.
 *
 * We alias this type to `Lazy` and make it available globally for ease of
 * use and superior readability.
 */
type Lazy<T> = _.LoDashExplicitWrapper<T>

import { chain, keyBy } from 'lodash'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import { Observable } from 'rx'
import { PostAdequaciesResponse } from '../constants/api/adequacies-response'
import { Error, Success } from '../constants/api/geocode-response'
import { AdequacyMode, GeocodedProvider, Method, Provider } from '../constants/datatypes'
import { SERVICE_AREAS_BY_COUNTY_BY_STATE } from '../constants/zipCodes'
import { boundingBox } from '../utils/geojson'
import { equals } from '../utils/list'
import { getAdequacies, getRepresentativePoints, isPostGeocodeSuccessResponse, postGeocode } from './api'
import { Store } from './store'

export function withEffects(store: Store) {

  /**
   * Update representative points when serviceAreas change
   */
  store
    .on('serviceAreas')
    .subscribe(async serviceAreas => {
      let points = await getRepresentativePoints({ service_area_ids: serviceAreas })

      // Sanity check: If the user changed service areas between when the
      // POST /api/representative_points request was dispatched and now,
      // then cancel this operation.
      if (!equals(serviceAreas, store.get('serviceAreas'))) {
        return
      }

      store.set('representativePoints')(
        points.map(_ => ({
          ..._,
          population: _.population,
          serviceAreaId: _.service_area_id
        }))
      )
    })

  /**
   * When representative points change, auto-center and auto-zoom to a bounding
   * box containing all representative points.
   *
   * When the user selects a service area in the Analysis drawer, auto-center
   * and auto-zoom to a bounding box containing that service area.
   *
   * TODO: Replace this imperative bounds-setting with a declarative approach:
   *    1. Replace `store.mapCenter` and `store.mapZoom` with `store.mapBounds`
   *    2. Delete `store.map`
   */
  store.on('representativePoints').subscribe(async representativePoints => {
    // TODO: Use an Option for clarity
    let map = store.get('map')
    if (!map) {
      return
    }
    let bounds = boundingBox(representativePoints)
    if (!bounds) {
      return
    }
    map.fitBounds(new LngLatBounds(
      new LngLat(bounds.sw.lng, bounds.sw.lat),
      new LngLat(bounds.ne.lng, bounds.ne.lat)
    ))
  })

  /**
   * Geocode providers when uploadedProviders changes.
   */
  store.on('uploadedProviders').subscribe(async providers => {

    let geocodedProviders = providers.filter(provider => provider.lat !== undefined && provider.lng !== undefined) as GeocodedProvider[]
    let providersToGeocode = providers.filter(provider => provider.lat === undefined || provider.lng === undefined)

    if (providersToGeocode.length) {
      let result = await postGeocode({ addresses: providersToGeocode.map(_ => _.address) })
      geocodedProviders = geocodedProviders.concat(
        chain(result)
          .zip<Provider | Success | Error>(providers)
          .partition(([res]: [Success | Error]) => isPostGeocodeSuccessResponse(res))
          .tap(([successes, errors]) => {
            if (errors.length > 0) {
              store.set('error')(`Failed to geocode ${errors.length} (out of ${errors.length + successes.length}) providers`)
            } else if (successes.length > 0) {
              store.set('success')(`All ${successes.length} providers geocoded`)
            }
          })
          .first()
          .map(([res, req]: [Success, Provider]) => ({
            ...req,
            lat: res.lat,
            lng: res.lng
          }))
          .value()
      )
    }

    store.set('providers')(geocodedProviders)
  })

  /**
   * Fetch adequacies when providers, representative points, or method change
   */
  Observable
    .combineLatest(
    store.on('providers'),
    store.on('representativePoints'),
    store.on('selectedServiceArea').startWith(store.get('selectedServiceArea')),
    store.on('route'),
    store.on('method').startWith(store.get('method'))
    )
    .subscribe(async ([providers, representativePoints, selectedServiceArea, route, method]) => {
      // Reset adequacies.
      store.set('adequacies')({})

      /*
      * If there are no providers or no representative points, do not compute adequacies
      * and avoid errors in `getAdequacies`.
      */
      if (!providers.length || !representativePoints.length) {
        return
      }

      // Only compute adequacy when in the analytics panel.
      if (route !== '/analytics')
        return

      let serviceAreas = store.get('serviceAreas')

      // When the user selects a service area in Analytics, then unchecks it in
      // Service Areas we fire this effect before we finish recomputing service areas.
      // To avoid an inconsistent state, we fetch the latest representative points here.
      //
      // TODO: Do this more elegantly to avoid the double-computation.
      let [adequacies, points] = await Promise.all([
        getAdequacies({
          method,
          providers: providers.map((_, n) => ({ latitude: _.lat, longitude: _.lng, id: n })),
          service_area_ids: serviceAreas
        }),
        representativePoints
      ])

      // Sanity check: If the user changed service areas between when the
      // POST /api/representative_points request was dispatched and now,
      // then cancel this operation.
      if (!equals(serviceAreas, store.get('serviceAreas'))) {
        return
      }

      let hash = keyBy(points, 'id')

      store.set('adequacies')(
        chain(points)
          .map(_ => _.id)
          .zipObject(adequacies)
          .mapValues((_, key) => ({
            adequacyMode: getAdequacyMode(
              _, method, hash[key].serviceAreaId, selectedServiceArea
            ),
            id: _.id,
            toClosestProvider: _.to_closest_provider,
            closestProvider: providers[_.closest_providers[0]]
          }))
          .value()
      )
    })

  /**
   * If the user selects a service area, then deselects that service area's
   * zip code or county in the Service Area drawer, we should de-select the
   * service area too.
   */
  store.on('serviceAreas').subscribe(serviceAreas => {
    let selectedServiceArea = store.get('selectedServiceArea')
    if (selectedServiceArea && !serviceAreas.includes(selectedServiceArea)) {
      store.set('selectedServiceArea')(null)
    }
  })

  /**
   * When the user changes the selected state, clear the selected counties.
   */
  store
    .on('selectedState')
    .subscribe(() =>
      store.set('counties')([])
    )

  /**
   * When the user checks/unchecks counties in the `<CountySelector />`, we
   * update `serviceAreas` to the service areas in the selected counties.
   */
  store
    .on('counties')
    .subscribe(counties =>
      store.set('serviceAreas')(
        chain(counties)
          .map(_ => SERVICE_AREAS_BY_COUNTY_BY_STATE[store.get('selectedState')][_])
          .flatten()
          .value()
      )
    )

  /**
   * When the user adds representative points,
   * make sure that providers appear on top.
   * TODO - Invetsigate less hacky method.
   */
  store
    .on('representativePoints')
    .subscribe(representativePoints => {
      let temp_providers = store.get('providers')
      if (representativePoints.length && temp_providers.length) {
        store.set('providers')([])
        store.set('providers')(temp_providers)
      }
    }
    )

  /**
   * Clear state when the user selects a dataset in the Datasets Drawer.
   */
  store
    .on('selectedDataset')
    .subscribe(selectedDataset => {
      if (selectedDataset && store.get('route') === '/add-data') {
        store.set('route')('/analytics')
      }
      if (selectedDataset) {
        store.set('serviceAreas')(selectedDataset.serviceAreaIds)
        store.set('providers')(selectedDataset.providers)
        store.set('route')('/analytics')
      } else {
        store.set('providers')([])
        store.set('route')('/datasets')
        store.set('serviceAreas')([])
      }
    })
  return store
}

let ONE_MILE_IN_METERS = 1609.344
let ONE_METER_IN_MILES = 1.0 / ONE_MILE_IN_METERS

function getAdequacyMode(
  adequacy: PostAdequaciesResponse[0],
  method: Method,
  serviceAreaId: string,
  selectedServiceArea: string | null
): AdequacyMode {

  if (selectedServiceArea && serviceAreaId !== selectedServiceArea) {
    return AdequacyMode.OUT_OF_SCOPE
  }

  if (method === 'haversine') {
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 15) {
      return AdequacyMode.ADEQUATE_15
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 30) {
      return AdequacyMode.ADEQUATE_30
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 60) {
      return AdequacyMode.ADEQUATE_60
    }
  }

  if (method === 'driving_time') {
    if (adequacy.to_closest_provider <= 15) {
      return AdequacyMode.ADEQUATE_15
    }
    if (adequacy.to_closest_provider <= 30) {
      return AdequacyMode.ADEQUATE_30
    }
    if (adequacy.to_closest_provider <= 60) {
      return AdequacyMode.ADEQUATE_60
    }
  }

  return AdequacyMode.INADEQUATE
}

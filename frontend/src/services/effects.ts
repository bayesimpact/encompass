import { chain, chunk, filter, keyBy, uniq } from 'lodash'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import { Observable } from 'rx'
import { CONFIG } from '../config/config'
import { PostAdequaciesResponse } from '../constants/api/adequacies-response'
import { Error, Success } from '../constants/api/geocode-response'
import { AdequacyMode, Dataset, GeocodedProvider, Method, Provider } from '../constants/datatypes'
import { SERVICE_AREAS_BY_STATE } from '../constants/zipCodes'
import { ZIPS_BY_COUNTY_BY_STATE } from '../constants/zipCodesByCountyByState'
import { parseSerializedServiceArea } from '../utils/formatters'
import { boundingBox, representativePointsToGeoJSON } from '../utils/geojson'
import { equals } from '../utils/list'
import { getPropCaseInsensitive } from '../utils/serializers'
import {
  getAdequacies, getCensusData, getRepresentativePoints,
  getStaticAdequacies, getStaticDemographics, getStaticRPs, isPostGeocodeSuccessResponse,
  postGeocode
} from './api'
import { Store } from './store'

/**
 * Determine whether to use the static behaviours or the dynamic ones.
 */
const appIsStatic = CONFIG.staticAssets.appIsStatic

export function withEffects(store: Store) {
  /**
   * Update representative points when serviceAreas change.
   */
  store
    .on('serviceAreas')
    .subscribe(async serviceAreas => {
      const selectedDataset = store.get('selectedDataset')

      // Clear the points when unselecting a dataset.
      if (serviceAreas.length === 0) {
        store.set('representativePoints')([])
      }

      // Get representative points.
      const points = appIsStatic ? await getStaticRPs(selectedDataset) :
        await getRepresentativePoints({ service_area_ids: serviceAreas })

      // Get census information at the service area level.
      const censusData = CONFIG.is_census_data_available ? appIsStatic ? await getStaticDemographics(selectedDataset) :
        await getCensusData({ service_area_ids: serviceAreas }) : {}

      // Sanity check: If the user changed service areas between when the
      // POST /api/representative_points request was dispatched and now,
      // then cancel this operation.
      if (!equals(serviceAreas, store.get('serviceAreas'))) {
        return
      }

      store.set('counties')(uniq(serviceAreas.map(_ => parseSerializedServiceArea(_).county)))

      store.set('representativePoints')(
        points.map(_ => ({
          ..._,
          population: _.population,
          serviceAreaId: _.service_area_id,
          demographics: censusData[_.service_area_id]
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
          .zip<Provider | Success | Error>(providersToGeocode)
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

  function safeDatasetHint(dataset: Dataset | null) {
    if (dataset === null) {
      return ''
    }
    return dataset['hint']
  }

  /**
   * Fetch adequacies when providers, representative points, or method change
   */
  Observable
    .combineLatest(
      store.on('providers'),
      store.on('representativePoints'),
      store.on('selectedServiceAreas').startWith(store.get('selectedServiceAreas')),
      store.on('route'),
      store.on('method').startWith(store.get('method'))
    )
    .subscribe(async ([providers, representativePoints, selectedServiceAreas, route, method]) => {
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
      const adequacies = appIsStatic ? await getStaticAdequacies(store.get('selectedDataset'), store.get('method')) :
        await getAdequacies({
          method,
          providers: providers.map((_, n) => ({ latitude: _.lat, longitude: _.lng, id: n })),
          service_area_ids: serviceAreas,
          dataset_hint: safeDatasetHint(store.get('selectedDataset'))
        })
      const points = representativePoints

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
              _, method, hash[key].serviceAreaId, selectedServiceAreas
            ),
            id: _.id,
            toClosestProvider: _.to_closest_provider,
            closestProvider: providers[_.closest_providers[0]]
          }))
          .value()
      )
    })

  /**
   * Update selectedServiceAreas when selected county changes.
   */
  store.on('selectedCounties').subscribe(selectedCounties => {
    if (selectedCounties !== null) {
      let selectedServiceAreas = filter(store.get('serviceAreas'), function (sA) {
        return selectedCounties.includes(parseSerializedServiceArea(sA).county)
      })
      store.set('selectedServiceAreas')(selectedServiceAreas)
    }
  })

  /**
   * Filter counties by urban/rural if the countyTypeSelector is in use.
   */
  store.on('selectedCountyType').subscribe(selectedCountyType => {
    if (selectedCountyType === 'Urban' || selectedCountyType === 'Rural') {
      let selectedServiceAreas = filter(store.get('serviceAreas'), function (sA) {
        let { state, county } = parseSerializedServiceArea(sA)
        let nhcs_code = getPropCaseInsensitive(ZIPS_BY_COUNTY_BY_STATE[state], county).nhcs_code
        let urban = nhcs_code <= 4
        return (selectedCountyType === 'Urban') ? urban : !urban
      })
      store.set('selectedServiceAreas')(selectedServiceAreas)
    } else if (selectedCountyType === 'All') {
      store.set('selectedServiceAreas')(store.get('serviceAreas'))
    }
  })

  /**
   * If the user selects a new selector method, re-select all service areas.
   * And reset selectors to 'All Counties'.
   */
  store.on('selectedFilterMethod').subscribe(selectedFilterMethod => {
    if (selectedFilterMethod === 'County Type') {
      store.set('selectedCountyType')(null)
    }
    if (selectedFilterMethod === 'All') {
      store.set('selectedServiceAreas')(null)
    }
    if (selectedFilterMethod === 'County Name') {
      store.set('selectedCounties')(null)
    }
  })

  /**
   * When the user changes the selected state, clear the selected counties.
   */
  store
    .on('selectedState')
    .subscribe(() => {
      store.set('counties')([])
      store.set('selectedCounties')(null)
      store.set('useCustomCountyUpload')(null)
    })

  /**
   * When the user adds representative points,
   * make sure that providers appear on top.
   * TODO - Investigate less hacky method.
   */
  store
    .on('representativePoints')
    .subscribe(representativePoints => {
      store.set('adequacies')({})
      let temp_providers = store.get('providers')
      if (representativePoints.length && temp_providers.length) {
        store.set('providers')([])
        store.set('providers')(temp_providers)
      }
    }
    )

  /**
   * Rebuild the geojson whenever the adequacies change.
   */
  store
    .on('adequacies')
    .filter(Boolean)
    .subscribe(adequacies => {
      let representativePoints = store.get('representativePoints')
      if (representativePoints === null) {
        store.set('pointFeatureCollections')(null)
      } else {
        let chunkSize = Math.floor(representativePoints.length / 10)
        store.set('pointFeatureCollections')(
          chunk(representativePoints, chunkSize).map(rpChunk => representativePointsToGeoJSON(adequacies, store.get('method'))(rpChunk))
        )
      }
    })

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
        store.set('selectedState')(selectedDataset.state)
        store.set('route')('/analytics')
      } else {
        store.set('providers')([])
        store.set('route')('/datasets')
        store.set('serviceAreas')([])
        store.set('selectedFilterMethod')('All')
      }
    })

  /**
   * Switch to haversine of the app is public and user is adding a dataset.
   */
  store
    .on('route')
    .subscribe(route => {
      if (route === '/add-data') {
        store.set('allowDrivingTime')(CONFIG.analysis.allow_driving_time)
        store.set('method')('straight_line')
      } else if (route === '/datasets') {
        store.set('allowDrivingTime')(true)
        store.set('method')('driving_time')
      }
    })

  /**
   * Select all states when "All" is selected in Add dataset DatasetCountySelection.
   */
  store
    .on('useCustomCountyUpload')
    .subscribe(useCustomUpload => {
      if (useCustomUpload) {
        store.set('serviceAreas')([])
      } else if (useCustomUpload === false) {
        store.set('serviceAreas')(SERVICE_AREAS_BY_STATE[store.get('selectedState')])
        store.set('uploadedServiceAreasFilename')(null)
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
  selectedServiceAreas: string[] | null
): AdequacyMode {

  if (selectedServiceAreas && !selectedServiceAreas.includes(serviceAreaId)) {
    return AdequacyMode.OUT_OF_SCOPE
  }

  if (method === 'straight_line') {
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 10) {
      return AdequacyMode.ADEQUATE_0
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 20) {
      return AdequacyMode.ADEQUATE_1
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 30) {
      return AdequacyMode.ADEQUATE_2
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES > 30) {
      return AdequacyMode.INADEQUATE
    }
    return AdequacyMode.OUT_OF_SCOPE
  }

  if (method === 'driving_time' || method === 'walking_time') {
    if (adequacy.to_closest_provider <= 30) {
      return AdequacyMode.ADEQUATE_0
    }
    if (adequacy.to_closest_provider <= 45) {
      return AdequacyMode.ADEQUATE_1
    }
    if (adequacy.to_closest_provider <= 60) {
      return AdequacyMode.ADEQUATE_2
    }
    if (adequacy.to_closest_provider > 60) {
      return AdequacyMode.INADEQUATE
    }
  }
  return AdequacyMode.OUT_OF_SCOPE
}

import * as gfilter from 'geojson-filter'
import { chain, chunk, keyBy, uniq } from 'lodash'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import { combineLatest } from 'rxjs'
import { filter, startWith } from 'rxjs/operators'
import { Plugin } from 'undux'
import { CONFIG } from '../config/config'
import { Error, Success } from '../constants/api/geocode-response'
import { GeocodedProvider, Provider } from '../constants/datatypes'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants/map'
import { SERVICE_AREAS_BY_STATE } from '../constants/zipCodes'
import { ZIPS_BY_COUNTY_BY_STATE } from '../constants/zipCodesByCountyByState'
import { getAdequacyMode } from '../utils/adequacy'
import { parseSerializedServiceArea, safeDatasetHint } from '../utils/formatters'
import { boundingBox, representativePointsToGeoJSON } from '../utils/geojson'
import { equals } from '../utils/list'
import { getPropCaseInsensitive } from '../utils/serializers'
import {
  getAdequacies, getCensusData, getRepresentativePoints,
  getStaticAdequacies, getStaticDemographics, getStaticRPs, isPostGeocodeSuccessResponse,
  postGeocode
} from './api'
import { State } from './store'

/**
 * Determine whether to use the static behaviours or the dynamic ones.
 */
const appIsStatic = CONFIG.staticAssets.appIsStatic

export let withEffects: Plugin<State> = store => {
  /**
   * Update representative points when serviceAreas change.
   */
  store
    .on('serviceAreas')
    .subscribe(async serviceAreas => {

      // Clear the points when unselecting a dataset.
      if (serviceAreas.length === 0) {
        store.set('counties')([])
        store.set('representativePoints')([])

        // TODO: Do this declaratively
        let map = store.get('map')
        if (map) {
          map.setCenter(new mapboxgl.LngLat(DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_CENTER.lat))
          map.setZoom(DEFAULT_MAP_ZOOM[0])
        }
        return
      }

      const selectedDataset = store.get('selectedDataset')

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
          population: Number(_.population),
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

  /**
   * Fetch adequacies when providers, representative points, or method change
   */
  combineLatest(
    store.on('providers'),
    store.on('representativePoints'),
    store.on('selectedServiceAreas').pipe(startWith(store.get('selectedServiceAreas'))),
    store.on('route'),
    store.on('method').pipe(startWith(store.get('method')))
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
   * TODO: Optimize this to avoid n^2 lookup.
   */
  store.on('selectedCounties').subscribe(selectedCounties => {
    if (selectedCounties !== null) {
      let selectedServiceAreas = store.get('serviceAreas').filter(_ =>
        selectedCounties.includes(parseSerializedServiceArea(_).county)
      )
      store.set('selectedServiceAreas')(selectedServiceAreas)
    }
  })

  /**
   * Filter counties by urban/rural if the countyTypeSelector is in use.
   */
  store.on('selectedCountyType').subscribe(selectedCountyType => {
    if (selectedCountyType === 'Urban' || selectedCountyType === 'Rural') {
      let selectedServiceAreas = store.get('serviceAreas').filter(_ => {
        let { state, county } = parseSerializedServiceArea(_)
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
    .subscribe((selectedState) => {
      store.set('adequacies')({})
      store.set('counties')([])
      store.set('selectedCounties')(null)
      store.set('useCustomCountyUpload')(null)
      store.set('selectedFilterMethod')('All')
      let dataset = store.get('selectedDataset')
      if (dataset && store.get('route') === '/analytics') {
        dataset.state = selectedState
        store.set('selectedDataset')(dataset)
      }
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
   * Rebuild the geojson whenever the adequacies or selectedCensusGroup change.
   * Also close any open representative point tooltips.
   */
  combineLatest(
    store.on('adequacies'),
    store.on('selectedCensusGroup').pipe(startWith(store.get('selectedCensusGroup')))
  )
    .pipe(
      filter(Boolean)
    )
    .subscribe(async ([adequacies, selectedCensusGroup]) => {
      let representativePoints = store.get('representativePoints')
      if (representativePoints === null) {
        store.set('pointFeatureCollections')(null)
      } else {
        let chunkSize = Math.floor(representativePoints.length / 10)
        let filter = ['>=', 'population', 1]
        store.set('pointFeatureCollections')(
          chunk(representativePoints, chunkSize).map(rpChunk => gfilter(representativePointsToGeoJSON(
            adequacies, store.get('method'), store.get('selectedCensusCategory'), selectedCensusGroup)(rpChunk),
            filter)
          )
        )
        // Close any open representative point tooltips.
        store.set('selectedRepresentativePoint')(null)
      }
    })

  store
    .on('selectedCensusCategory')
    .subscribe(_ => {
      store.set('selectedCensusGroup')('Total Population')
    })

  /**
   * Clear state when the user selects a dataset in the Datasets Drawer.
   */
  store
    .on('selectedDataset')
    .subscribe(selectedDataset => {
      if (selectedDataset && store.get('route') === '/analytics') {
        return
      }
      if (selectedDataset && store.get('route') === '/add-data') {
        store.set('route')('/analytics')
      }
      if (selectedDataset) {
        store.set('serviceAreas')(selectedDataset.serviceAreaIds)
        store.set('providers')(selectedDataset.providers)
        store.set('selectedState')(selectedDataset.state)
        store.set('route')('/analytics')
        if (selectedDataset.defaultDemographics) {
          store.set('selectedCensusCategory')(selectedDataset.defaultDemographics.censusCategory.toLowerCase())
          store.set('selectedCensusGroup')(selectedDataset.defaultDemographics.censusGroup)
        }
      } else {
        store.set('providers')([])
        store.set('route')('/datasets')
        store.set('serviceAreas')([])
        store.set('selectedFilterMethod')('All')
        store.set('selectedCensusGroup')('Total Population')
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

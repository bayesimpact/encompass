import { chain, keyBy } from 'lodash'
import { LngLat, LngLatBounds } from 'mapbox-gl'
import { Observable } from 'rx'
import { PostAdequaciesResponse } from '../constants/api/adequacies-response'
import { PostProvidersRequest } from '../constants/api/providers-request'
import { PostProvidersResponse, Success } from '../constants/api/providers-response'
import { AdequacyMode, Measure, Standard } from '../constants/datatypes'
import { TIME_DISTANCES } from '../constants/timeDistances'
import { SERVICE_AREAS_BY_COUNTY_BY_STATE } from '../constants/zipCodes'
import { representativePointsFromServiceAreas } from '../utils/data'
import { boundingBox } from '../utils/geojson'
import { equals } from '../utils/list'
import { getAdequacies, getRepresentativePoints, isWriteProvidersSuccessResponse, postProviders } from './api'
import { Store } from './store'

export function withEffects(store: Store) {

  /**
   * Update representative points when distribution or serviceAreas change
   */
  Observable
    .combineLatest(
    store.on('distribution').startWith(store.get('distribution')),
    store.on('serviceAreas').startWith(store.get('serviceAreas'))
    )
    .subscribe(async ([distribution, serviceAreas]) => {
      let points = await getRepresentativePoints({ service_area_ids: serviceAreas })

      // Sanity check: If the user changed service areas between when the
      // POST /api/representative_points request was dispatched and now,
      // then cancel this operation.
      if (!equals(serviceAreas, store.get('serviceAreas'))) {
        return
      }

      // JavaScript doesn't preserve zero points for numbers. Because
      // `population` keys are strings in ("0.5", "2.5", "5.0"), when
      // `distribution` is 5 we need to manually convert it to the string
      // "5.0" so that we can check it against its corresponding key.
      let _distribution = distribution.toFixed(1)

      // Backend returns representative points for all distances at once.
      // Frontend then plucks out the points it needs, duck-typing on whether or
      // not the given point's `population` object has the current distance
      // defined as a key on it.
      store.set('representativePoints')(
        chain(points)
          .filter(_ => _distribution in _.population)
          .map(_ => ({
            ..._,
            population: (_.population as any)[_distribution]!, // TODO: Avoid any
            serviceAreaId: _.service_area_id
          }))
          .value()
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
  Observable.combineLatest(
    store.on('representativePoints').startWith(store.get('representativePoints')),
    store.on('selectedServiceArea').startWith(store.get('selectedServiceArea'))
  ).debounce(0).subscribe(([representativePoints, selectedServiceArea]) => {

    // TODO: Use an Option for clarity
    let map = store.get('map')
    if (!map) {
      return
    }
    let bounds = selectedServiceArea
      ? boundingBox(representativePointsFromServiceAreas([selectedServiceArea], store).value())
      : boundingBox(representativePoints)
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
    let result = await postProviders({ providers })
    store.set('providers')(
      chain(result)
        .zip<PostProvidersResponse[0] | PostProvidersRequest['providers'][0]>(providers)
        .partition(([res]: [PostProvidersResponse[0]]) => isWriteProvidersSuccessResponse(res))
        .tap(([successes, errors]) => {
          if (errors.length > 0) {
            store.set('error')(`Failed to geocode ${errors.length} (out of ${errors.length + successes.length}) providers`)
          } else if (successes.length > 0) {
            store.set('success')(`All ${successes.length} providers geocoded`)
          }
        }
        )
        .first()
        .map(([res, req]: [Success, PostProvidersRequest['providers'][0]]) => ({
          ...req,
          lat: res.lat,
          lng: res.lng
        }))
        .value()
    )
  })

  /**
   * Fetch adequacies when providers, representative points, measure, or standards change
   */
  Observable
    .combineLatest(
    store.on('providers'),
    store.on('representativePoints'),
    store.on('selectedServiceArea').startWith(store.get('selectedServiceArea')),
    store.on('measure').startWith(store.get('measure')),
    store.on('standard').startWith(store.get('standard'))
    )
    .subscribe(async ([providers, representativePoints, selectedServiceArea, measure, standard]) => {
      if (!providers.length || !representativePoints.length) {
        store.set('adequacies')({})
        return
      }

      let serviceAreas = store.get('serviceAreas')

      // When the user selects a service area in Analytics, then unchecks it in
      // Service Areas we fire this effect before we finish recomputing service areas.
      // To avoid an inconsistent state, we fetch the latest representative points here.
      //
      // TODO: Do this more elegantly to avoid the double-computation.
      let [adequacies, points] = await Promise.all([
        getAdequacies({
          providers: providers.map(_ => ({latitude: _.lat, longitude: _.lng})),
          service_area_ids: serviceAreas
        }),
        getRepresentativePoints({ service_area_ids: serviceAreas })
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
              _, measure, standard, hash[key].service_area_id, selectedServiceArea
            ),
            id: _.id,
            distanceToClosestProvider: _.distance_to_closest_provider,
            timeToClosestProvider: _.time_to_closest_provider,
            closestProviderByDistance: _.closest_provider_by_distance,
            closestProviderByTime: _.closest_provider_by_time
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

  return store
}

function getAdequacyMode(
  adequacy: PostAdequaciesResponse[0],
  measure: Measure,
  standard: Standard,
  serviceAreaId: string,
  selectedServiceArea: string | null
): AdequacyMode {

  if (selectedServiceArea && serviceAreaId !== selectedServiceArea) {
    return AdequacyMode.OUT_OF_SCOPE
  }

  if (isAdequate(
    adequacy.distance_to_closest_provider,
    adequacy.time_to_closest_provider,
    measure,
    standard
  )) {
    return AdequacyMode.ADEQUATE
  }
  return AdequacyMode.INADEQUATE
}

function isAdequate(
  distance: number,
  time: number,
  measure: Measure,
  standard: Standard
) {
  switch (standard) {
    case 'distance':
      return distance < measure
    case 'time_distance':
      return distance < measure && time < TIME_DISTANCES.get(measure)!
    case 'time':
      return time < TIME_DISTANCES.get(measure)!
  }
}

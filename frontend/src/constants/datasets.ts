import { Dataset } from './datatypes'
// import { CaliforniaFKMServiceAreas } from './states'
import { SERVICE_AREAS_BY_STATE } from './zipCodes'

export let DATASETS: Dataset[] = [
    {
        dataSources: [
            'Tanzania',
            'Healthsites.io'
        ],
        state: 'tz',
        description: 'Healthsites.io',
        name: 'Healthsites.io Tanzania',
        hint: 'tz',
        providers: [
            {
                address: '16928 11TH ST., HURON, CA 93234',
                languages: [],
                npi: '1841424728',
                specialty: 'Psychiatry',
                lat: -6.3690,
                lng: 34.8888
            }
        ],
        serviceAreaIds: SERVICE_AREAS_BY_STATE.tz
    }
]

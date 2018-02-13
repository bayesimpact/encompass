/**
 * This file was automatically generated.
 * DO NOT MODIFY IT BY HAND. Instead, run "yarn codegen" to regenerate it.
 */

type censusMapping = {
    [category: string]: string[]
}

export const CENSUS_MAPPING_ERROR = 'No Census Mapping Detected'

export const CENSUS_MAPPING: censusMapping = {
    age: [
        'percent_age_under_5_y',
        'percent_age_5_9_y',
        'percent_age_10_14_y',
        'percent_age_15_19_y',
        'percent_age_20_24_y',
        'percent_age_25_34_y',
        'percent_age_35_44_y',
        'percent_age_45_54_y',
        'percent_age_55_59_y',
        'percent_age_60_64_y',
        'percent_age_65_74_y',
        'percent_age_75_84_y',
        'percent_age_over_85_y'
    ],
    sex: ['percent_sex_male', 'percent_sex_female']
}

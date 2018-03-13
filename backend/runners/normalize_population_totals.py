"""
Methods to update population totals to match census totals.

NOTE: These methods require the census tables to exist and contain data.
In particular, the data profile table DP05 from the ACS is used for population estimates.
See the `load_census_demographics` script for instructions on how to populate these tables.
"""
from backend.lib.database.postgres import connect

"""
This query will update the representative points table's population numbers to match
the census population numbers at the county level. For example, if the points in Los Angeles
County, CA have a total population of 12 million but the ACS estimate is 10 million, all
points' populations will be multiplied by 10/12 so that the total population afterwards
is also 10 million.

Counties are identified using FIPS codes: the first 5 digits of the census tract ID represent
the state (2 digits) and the county (3).
"""
POPULATION_UPDATE_QUERY_COUNTY_LEVEL = """
    WITH census_population AS (
        SELECT
            LEFT(census_tract, 5) AS county
            , SUM(hc01_vc03) AS census_pop
        FROM census_acs_dp_05
        GROUP BY 1
    ),
    raw_population AS (
        SELECT
            LEFT(census_tract, 5) AS county
            , SUM(population) AS raw_pop
        FROM representative_points
        GROUP BY 1
    ),
    census_to_raw_ratio AS (
        SELECT
            census.county AS county
            , census_pop / raw_pop AS ratio
        FROM census_population census
        JOIN raw_population raw
        ON census.county = raw.county
    )
    UPDATE representative_points AS rps
    SET population =
        COALESCE(
            ratios.ratio * population
            , population
        )
    FROM census_to_raw_ratio ratios
    WHERE LEFT(census_tract, 5) = ratios.county
    ;
"""


if __name__ == '__main__':
    engine = connect.create_db_engine()
    with engine.begin() as conn:
        conn.execute(POPULATION_UPDATE_QUERY_COUNTY_LEVEL)

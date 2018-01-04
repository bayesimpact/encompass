# NOTE - Running this file requires postgres AND postigs.
TMPDIR="/tmp/gisdata/temp/"
UNZIPTOOL=unzip
WGETTOOL="/usr/bin/wget"
export PGBIN=/usr/lib/postgresql/9.6/bin
export PGPORT=5432
export PGHOST=time-distance-database.clac22tiomrx.us-west-2.rds.amazonaws.com
export PGUSER=tds
export PGDATABASE=postgres
PSQL=psql
SHP2PGSQL=shp2pgsql

# Get Postgres password.
echo -n Postgres password: 
read -s password
export PGPASSWORD=$password

mkdir /tmp/gisdata
cd /tmp/gisdata
wget http://www2.census.gov/geo/tiger/TIGER2016/STATE/tl_2016_us_state.zip --mirror --reject=html
cd /tmp/gisdata/www2.census.gov/geo/tiger/TIGER2016/STATE
rm -f ${TMPDIR}/*.*

${PSQL} -c "DROP SCHEMA IF EXISTS tiger_staging CASCADE;"
${PSQL} -c "CREATE SCHEMA tiger_staging;"
for z in tl_*state.zip ; do $UNZIPTOOL -d $TMPDIR $z; done
cd $TMPDIR;

${PSQL} -c "alter table state owner to ${PGUSER}"
${PSQL} -c "CREATE TABLE tiger_data.state_all(CONSTRAINT pk_state_all PRIMARY KEY (statefp),CONSTRAINT uidx_state_all_stusps  UNIQUE (stusps), CONSTRAINT uidx_state_all_gid UNIQUE (gid) ) INHERITS(tiger.state); "
${SHP2PGSQL} -D -c -s 4269 -g the_geom   -W "latin1" tl_2016_us_state.dbf tiger_staging.state | ${PSQL}
${PSQL} -c "SELECT loader_load_staged_data(lower('state'), lower('state_all')); "
	${PSQL} -c "CREATE INDEX tiger_data_state_all_the_geom_gist ON tiger_data.state_all USING gist(the_geom);"
	${PSQL} -c "VACUUM ANALYZE tiger_data.state_all"
cd /tmp/gisdata
wget http://www2.census.gov/geo/tiger/TIGER2016/COUNTY/tl_2016_us_county.zip --mirror --reject=html
cd /tmp/gisdata/www2.census.gov/geo/tiger/TIGER2016/COUNTY
rm -f ${TMPDIR}/*.*
${PSQL} -c "DROP SCHEMA IF EXISTS tiger_staging CASCADE;"
${PSQL} -c "CREATE SCHEMA tiger_staging;"
for z in tl_*county.zip ; do $UNZIPTOOL -o -d $TMPDIR $z; done
cd $TMPDIR;

${PSQL} -c "CREATE TABLE tiger_data.county_all(CONSTRAINT pk_tiger_data_county_all PRIMARY KEY (cntyidfp),CONSTRAINT uidx_tiger_data_county_all_gid UNIQUE (gid)  ) INHERITS(tiger.county); " 
${SHP2PGSQL} -D -c -s 4269 -g the_geom   -W "latin1" tl_2016_us_county.dbf tiger_staging.county | ${PSQL}
${PSQL} -c "ALTER TABLE tiger_staging.county RENAME geoid TO cntyidfp;  SELECT loader_load_staged_data(lower('county'), lower('county_all'));"
	${PSQL} -c "CREATE INDEX tiger_data_county_the_geom_gist ON tiger_data.county_all USING gist(the_geom);"
	${PSQL} -c "CREATE UNIQUE INDEX uidx_tiger_data_county_all_statefp_countyfp ON tiger_data.county_all USING btree(statefp,countyfp);"
	${PSQL} -c "CREATE TABLE tiger_data.county_all_lookup ( CONSTRAINT pk_county_all_lookup PRIMARY KEY (st_code, co_code)) INHERITS (tiger.county_lookup);"
	${PSQL} -c "VACUUM ANALYZE tiger_data.county_all;"
	${PSQL} -c "INSERT INTO tiger_data.county_all_lookup(st_code, state, co_code, name) SELECT CAST(s.statefp as integer), s.abbrev, CAST(c.countyfp as integer), c.name FROM tiger_data.county_all As c INNER JOIN state_lookup As s ON s.statefp = c.statefp;"
	${PSQL} -c "VACUUM ANALYZE tiger_data.county_all_lookup;" 
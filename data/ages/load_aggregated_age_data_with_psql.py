# Use psql to load all the transformed age CSVs.
import os
import subprocess

# Absolute path on my local FS. FIXME parameterise.
DIR_PATH = '/Users/philip/repos/tds/data/ages/transformed/'

PSQL_COMMAND = 'psql --host time-distance-database.clac22tiomrx.us-west-2.rds.amazonaws.com ' \
               '--username tds --db network_adequacy -c "\\copy ' \
               'aggregated_ages from \'{csv_file_path}\' with DELIMITER \',\'"'

PASSWORD = 'password goes here'  # Do not keep password in SCM.

# Setup environment for psql.
env = os.environ.copy()
env['PGPASSWORD'] = PASSWORD

for filename in os.listdir(DIR_PATH):
    print('loading {}'.format(filename))
    command = PSQL_COMMAND.format(csv_file_path=DIR_PATH + filename)
    subprocess.call(command, shell=True, env=env)

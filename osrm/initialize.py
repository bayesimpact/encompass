#!/usr/bin/python3
"""
This file contains the commands to spin up an OSRM routing server.

The variables below are set for a single state. For all of North America, use
OSM_PBF_URL = 'http://download.geofabrik.de/north-america-latest.osm.pbf'

To process the complete North America fiile, you will need:
  - Around 150GB of RAM (real or swap)
  - Around 200GB of Hard Drive

To process it, we suggest temporarily setting up the instance to be an m4.10xlarge, and
attach a 500GB root hard drive.
Alternatively, you could keep a smaller instance, and use an additional 500GB SSD and
use it as swap. To do so, find the name of the new drive (eg. mkswap /dev/sdb) and simply run:
  - mkswap /dev/sdb
  - swapon /dev/sdb
Verify that it is active by running:
  - swapon -s
"""
import os
import subprocess
import sys

OSM_PBF_URL = 'http://download.geofabrik.de/north-america/us/california-latest.osm.pbf'

VERBOSITY = 'DEBUG'
N_THREADS = 4


def _is_file_missing(filepath):
    """Return True if the file does not already exist."""
    return not os.path.isfile(filepath)


def fetch_osrm_data(osm_pbf_url):
    """Download the compressed road network files."""
    raw_filename = osm_pbf_url.split('/')[-1]
    raw_filepath = './data/osrm/{}'.format(raw_filename)
    steps = [
        {
            'name': 'Fetch compressed road network file.',
            'command':
                'wget {osm_url} '
                ' -O {filepath}'.format(
                    osm_url=osm_pbf_url,
                    filepath=raw_filepath
                )
        }
    ]
    exit_code = 0
    for step in steps:
        subprocess.call(args=['echo "{}"'.format(step['name'])], shell=True)
        subprocess.call(args=['echo "{}"'.format(step['command'])], shell=True)
        exit_code = subprocess.call(args=[step['command']], shell=True)
        if exit_code != 0:
            sys.exit(exit_code)


def process_osrm_data(raw_filepath, output_filepath):
    """Process the compressed routing file into a usable format."""
    steps = [
        {
            'name': 'Extract.',
            'command': '''
                osrm-extract --verbosity {} --threads {} --profile /opt/car.lua {}
            '''.format(
                VERBOSITY,
                N_THREADS,
                raw_filepath
            )
        },
        {
            'name': 'Partition.',
            'command': 'osrm-partition --verbosity {} --threads {} {}'.format(
                VERBOSITY,
                N_THREADS,
                output_filepath
            )
        },
        {
            'name': 'Customize.',
            'command': 'osrm-customize --verbosity {} --threads {} {}'.format(
                VERBOSITY,
                N_THREADS,
                output_filepath
            )
        },
    ]
    exit_code = 0
    for step in steps:
        subprocess.call(args=['echo "{}"'.format(step['name'])], shell=True)
        subprocess.call(args=['echo "{}"'.format(step['command'])], shell=True)
        exit_code = subprocess.call(args=[step['command']], shell=True)
        if exit_code != 0:
            sys.exit(exit_code)


def start_osrm_server(output_filepath):
    """Start an OSRM server using the routing network contained in output_filepath."""
    routing_command = '''
            osrm-routed --verbosity {} --threads {} --algorithm mld {}
        '''.format(
        VERBOSITY,
        N_THREADS,
        output_filepath
    )
    exit_code = subprocess.call(args=[routing_command], shell=True)
    if exit_code != 0:
        sys.exit(exit_code)


def main(osm_pbf_url=OSM_PBF_URL):
    """
    Start an OSRM server using the provided routing network.

    This function will download and process the necessary data if the OSM file does not yet exist.
    """
    raw_filename = OSM_PBF_URL.split('/')[-1]
    raw_filepath = './data/osrm/{}'.format(raw_filename)
    output_filepath = raw_filepath.replace('osm.pbf', 'osrm')

    subprocess.call(args=['mkdir -p ./data/osrm/'], shell=True)
    if _is_file_missing(output_filepath):
        if _is_file_missing(raw_filepath):
            fetch_osrm_data(osm_pbf_url)
        process_osrm_data(raw_filepath, output_filepath)

    start_osrm_server(output_filepath)


if __name__ == '__main__':
    main()

#!/usr/bin/python3
"""This file contains the commands to spin up an OSRM routing server."""
import os
import subprocess
import sys


RAW_FILENAME = 'california-latest.osm.pbf'
RAW_FILEPATH = '/data/osrm/{}'.format(RAW_FILENAME)
OUTPUT_FILEPATH = RAW_FILEPATH.replace('osm.pbf', 'osrm')


def _is_file_missing(filepath):
    """Return True if the file does not already exist."""
    return not os.path.isfile(filepath)


def fetch_osrm_data(raw_filename):
    """Download the compressed road network files."""
    raw_filepath = '/data/osrm/{}'.format(raw_filename)
    steps = [
        {
            'name': 'Fetch compressed road network file.',
            'command':
                'wget http://download.geofabrik.de/north-america/us/{filename} '
                ' -O {filepath}'.format(
                    filename=raw_filename,
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
            'command': 'osrm-extract -p /opt/car.lua {}'.format(raw_filepath)
        },
        {
            'name': 'Partition.',
            'command': 'osrm-partition {}'.format(output_filepath)
        },
        {
            'name': 'Customize.',
            'command': 'osrm-customize {}'.format(output_filepath)
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
    routing_command = 'osrm-routed --algorithm mld {}'.format(output_filepath)
    exit_code = subprocess.call(args=[routing_command], shell=True)
    if exit_code != 0:
        sys.exit(exit_code)


def main(raw_filepath=RAW_FILEPATH, output_filepath=OUTPUT_FILEPATH):
    """
    Start an OSRM server using the routing network contained in output_filepath.

    This function will download and process the necessary data if the file does not yet exist.
    """
    raw_filename = raw_filepath.split('/')[-1]
    subprocess.call(args=['mkdir -p /data/osrm/'], shell=True)
    if _is_file_missing(output_filepath):
        if _is_file_missing(raw_filepath):
            fetch_osrm_data(raw_filename)
        process_osrm_data(raw_filepath, output_filepath)

    start_osrm_server(output_filepath)

if __name__ == '__main__':
    main()

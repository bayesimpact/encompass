#!/usr/local/bin/python3.6
"""
Create csvs from healthcare.gov data extracted from files or from the website directly.

The data is filtered by plan_ids for a given state, and by provider address to include
only in-state or neighboring state (if provided) addresses.

Csvs are output into data/healthcare_gov/[issuer_id].csv

This script will also output the number of providers per plan.
"""
import argparse
import ijson
import json
import logging
import os
import urllib

import pandas as pd

from lib import etl_helper

logging.basicConfig(level=logging.INFO)


def normalize_provider(provider, plan_ids_set):
    """Flatten provider json blobs and filter by plan id."""
    normalized = []
    addresses = provider.pop('addresses')
    plans = provider.pop('plans')
    specialties = provider.pop('specialty')  # this is a list
    name = provider.pop('name')
    for plan in plans:
        if plan['plan_id'] not in plan_ids_set:
            continue
        for address in addresses:
            for specialty in specialties:
                to_append = {**address, **plan, **name, **provider}
                to_append['specialty'] = specialty
                normalized.append(to_append)
    return normalized


def filter_by_states(providers, states):
    """Filter providers by list of states to reduce the quantity of data we're processing."""
    return [provider for provider in providers if provider['state'] in states]


def _main(**kwargs):
    """Manually kickoff the json to csv file transformation for a given state."""
    state = kwargs['state']
    # Incorporate neighboring states if present
    states = [state]
    if kwargs['neighboring_states']:
        states.extend(kwargs['neighboring_states'])

    logging.info('Starting up translation process for {}'.format(state))

    plans = etl_helper.extract_plans(state)
    logging.info('There are {} plans listed in {}'.format(len(plans), state))
    logging.info('{}'.format([plan[0] for plan in plans]))

    # TODO: Use Plan Attributes file to exclude all dental plans.
    # Exclude dentists if the user wants.
    dental_plan_urls = [plan[1] for plan in plans if 'dent' in plan[1].lower()]
    if dental_plan_urls and etl_helper.query_yes_no(
            message="Would you like to exclude these dental plans? {}".format(dental_plan_urls)):
        plans = [plan for plan in plans if not plan[1] in dental_plan_urls]

    count_by_plan = {}
    for issuer_id, plan_url in plans:
        logging.info('Processing plan {} at url {}'.format(issuer_id, plan_url))
        plan_ids_set = etl_helper.get_issuer_plan_ids(issuer_id)

        output_path = etl_helper.HEALTHCARE_GOV_PATH + '/{}/{}.csv'.format(
            state, etl_helper.clean_plan_name(issuer_id))
        if os.path.exists(output_path):
            logging.info('CSV {} already exists. Moving on...'.format(output_path))
            continue

        try:
            provider_urls = etl_helper.fetch_provider_urls(plan_url)
        except Exception:
            logging.error(
                'Error fetching provider urls for {}. Moving on...'.format(issuer_id, plan_url))
            continue

        logging.info('There are {} provider urls for this plan'.format(len(provider_urls)))

        # Exclude pharmacists and facilities if the user wants.
        pharma_urls = [url for url in provider_urls if 'pharma' in url.lower()]
        if pharma_urls and etl_helper.query_yes_no(
                message="Would you like to exclude these pharma urls? {}".format(pharma_urls)):
            provider_urls = [url for url in provider_urls if url not in pharma_urls]

        providers = []
        for url in provider_urls:
            try:
                if kwargs['from_file']:
                    target_path = etl_helper.HEALTHCARE_GOV_PATH + '/{}/{}/{}.json'.format(
                        state, etl_helper.clean_plan_name(issuer_id), etl_helper.clean_paths(url)
                    )

                    if not os.path.exists(target_path):
                        logging.warning('Filepath {} doesn\'t exist. Skipping.'.format(target_path))
                        continue
                    file = open(target_path, 'r')
                else:
                    file = urllib.request.urlopen(url)

                objects = ijson.items(file, 'item')
                for provider in objects:
                    if provider['type'] != 'INDIVIDUAL':
                        continue
                    normalized_providers = normalize_provider(provider, plan_ids_set)

                    filtered_by_state = filter_by_states(normalized_providers, states)
                    providers.extend(filtered_by_state)
                logging.info('url {} successfully loaded'.format(url))
                if kwargs['from_file']:
                    file.close()
            except Exception:
                logging.exception('Error loading url {}. Continuing...'.format(url))
                continue

        logging.info('{} providers loaded for {}'.format(len(providers), issuer_id))

        # Load data into a DataFrame then export as csv.
        try:
            individuals = pd.DataFrame(providers)
            print(individuals.head())
            individuals.rename(columns={
                'first': 'first name', 'last': 'last name', 'middle': 'middle name'}, inplace=True)
            individuals.columns = [col.title() for col in individuals.columns]
            individuals.to_csv(output_path, index=False)
            logging.info('Csv for {} with {} rows written to {}'.format(
                issuer_id, individuals.shape[0], output_path))
            count_by_plan[issuer_id] = individuals.shape[0]
        except AttributeError:
            logging.exception('Something has gone wrong with loading data into the DataFrame')
            logging.info('Sample provider causing an error: {}'.format(providers[0]))

    logging.info('Final tally of processed providers: {}'.format(count_by_plan))


def _get_arguments():
    """Build argument parser."""
    parser = argparse.ArgumentParser(description='This starts a measure calculation.')

    parser.add_argument(
        '-s', '--state',
        help='State to extract data from.',
        required=True,
        type=str)

    parser.add_argument(
        '-ff', '--from_file',
        help='Flag for reading from filesystem instead of url.',
        action='store_true'
    )

    parser.add_argument(
        '-ns', '--neighboring_states',
        help='List of neighboring states to save data for.',
        required=False,
        nargs='+',
        type=str)

    args = parser.parse_args()

    return args.__dict__


if __name__ == '__main__':
    _main(**_get_arguments())

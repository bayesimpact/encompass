#!/usr/local/bin/python3.6
"""
Extract provider json files from Healthcare.gov provider endpoints.

Writes results to data folder in this repo

bayeshack github repo: https://github.com/bayesimpact/bayeshack-hhs-marketplace

Spreadsheet of links to all machine readable PUFs:
http://download.cms.gov/marketplace-puf/2016/machine-readable-url-puf.zip
"""
import argparse
import errno
import logging
import os
import pandas as pd
import requests

logging.basicConfig(level=logging.INFO)

HEALTHCARE_GOV_PATH = '/home/jovyan/work/data/healthcare_gov'
PATH_TO_PUFS = HEALTHCARE_GOV_PATH + '/healthcare_gov_plan_machine_readable_urls.csv'


def _extract_plans(state):
    """
    Extract plan names and URLs from the puf file.

    Returns list of tuples of (plan name, plan url)
    """
    df = pd.read_csv(PATH_TO_PUFS)
    df = df[df.State == state]
    return list(zip(df['Issuer Name'], df['URL Submitted']))


def _fetch_provider_urls(plan_url):
    """Fetch all provider urls listed on a plan's url."""
    response = requests.get(plan_url)
    response.raise_for_status()
    response_json = response.json()
    if 'provider_urls' in response_json:
        return response_json['provider_urls']
    logging.warning('No provider URLs available for plan url: {}'.format(plan_url))


def _clean_paths(url):
    """Translate urls into human-readable filenames."""
    to_remove = ['http://', 'https://', 'www.', '.com', '.json', '.']
    for item in to_remove:
        url = url.replace(item, '')

    return url.replace('/', '_')


def _clean_plan_name(plan_name):
    """Standardize plan name."""
    return str.lower(plan_name.replace(' ', '_'))


def query_yes_no(message, default='y'):
    """Query user for yes/no choide."""
    choices = 'Y/n' if default.lower() in ('y', 'yes') else 'y/N'
    choice = input('%s (%s) ' % (message, choices))
    values = ('y', 'yes', '') if choices == 'Y/n' else ('y', 'yes')
    return choice.strip().lower() in values


def _main(**kwargs):
    """Manually kickoff the ETL process for a given state."""
    state = kwargs['state']
    logging.info('Starting up ETL process for {}'.format(state))
    plans = _extract_plans(state)
    logging.info('There are {} plans listed in {}'.format(len(plans), state))
    logging.info('{}'.format([plan[0] for plan in plans]))

    # Exclude dentists if the user wants.
    dental_plan_names = [plan[0] for plan in plans if 'dent' in plan[0].lower()]
    if query_yes_no(message="Would you like to exclude these dental plans? {}".format(
            dental_plan_names)):
        plans = [plan for plan in plans if not plan[0] in dental_plan_names]

    for plan_name, plan_url in plans:
        logging.info('Processing plan {} at url {}'.format(plan_name, plan_url))

        try:
            provider_urls = _fetch_provider_urls(plan_url)
        except Exception:
            logging.error(
                'Error fetching provider urls for {}. Moving on...'.format(plan_name, plan_url))
            continue

        logging.info('There are {} provider urls for this plan'.format(len(provider_urls)))

        for url in provider_urls:
            target_path = HEALTHCARE_GOV_PATH + '/{}/{}/{}.json'.format(
                state, _clean_plan_name(plan_name), _clean_paths(url)
            )

            # Prevent downloading the same file if it already exists locally.
            if os.path.exists(target_path):
                logging.warning('Filepath {} already exists. Skipping...'.format(target_path))
                continue

            # Create directory for plan if it doesn't exist.
            if not os.path.exists(os.path.dirname(target_path)):
                try:
                    os.makedirs(os.path.dirname(target_path))
                except OSError as exc:  # Guard against race condition.
                    if exc.errno != errno.EEXIST:
                        raise
            try:
                response = requests.get(url, stream=True)
                handle = open(target_path, "wb")
                for chunk in response.iter_content(chunk_size=512):
                    if chunk:  # Filter out keep-alive new chunks.
                        handle.write(chunk)
                response.raise_for_status()
            except Exception:
                # Delete in progress downloaded file to ensure we get complete files.
                os.remove(target_path)
                logging.exception('Error fetching url {}. Deleting ...'.format(target_path))

        logging.info('Plan {} completed'.format(plan_name))


def _get_arguments():
    """Build argument parser."""
    parser = argparse.ArgumentParser(description='This starts a measure calculation.')

    parser.add_argument(
        '-s', '--state',
        help="""
             State to extract data from.
             """,
        required=True,
        type=str)

    args = parser.parse_args()

    return args.__dict__


if __name__ == '__main__':
    _main(**_get_arguments())

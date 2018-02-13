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
import requests

from lib import etl_helper


logging.basicConfig(level=logging.INFO)


def _main(**kwargs):
    """Manually kickoff the ETL process for a given state."""
    state = kwargs['state']
    logging.info('Starting up ETL process for {}'.format(state))
    plans = etl_helper.extract_plans(state)
    logging.info('There are {} plans listed in {}'.format(len(plans), state))
    logging.info('{}'.format([plan[0] for plan in plans]))

    # Exclude dentists if the user wants.
    dental_plan_urls = [plan[1] for plan in plans if 'dent' in plan[1].lower()]
    if etl_helper.query_yes_no(message="Would you like to exclude these dental plans? {}".format(
            dental_plan_urls)):
        plans = [plan for plan in plans if not plan[1] in dental_plan_urls]

    for issuer_id, plan_url in plans:
        logging.info('Processing plan {} at url {}'.format(issuer_id, plan_url))

        try:
            provider_urls = etl_helper.fetch_provider_urls(plan_url)
        except Exception:
            logging.error(
                'Error fetching provider urls for {}. Moving on...'.format(issuer_id, plan_url))
            continue

        logging.info('There are {} provider urls for this plan'.format(len(provider_urls)))

        for url in provider_urls:
            target_path = etl_helper.HEALTHCARE_GOV_PATH + '/{}/{}/{}.json'.format(
                state, etl_helper.clean_plan_name(issuer_id), etl_helper.clean_paths(url)
            )

            # Prevent downloading the same file if it already exists local
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

        logging.info('Plan {} completed'.format(issuer_id))


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

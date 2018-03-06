"""Functions utilized in more than one explorer script."""
import logging
import pandas as pd
import requests

HEALTHCARE_GOV_PATH = '/home/jovyan/work/data/healthcare_gov'
PATH_TO_PUFS = HEALTHCARE_GOV_PATH + '/Machine_Readable_URL_PUF.csv'
PATH_TO_PLANS = HEALTHCARE_GOV_PATH + '/Plan_Attributes_PUF.csv'


def get_issuer_plan_ids(issuer):
    """Given an issuer id, return all of the plan ids registered to that issuer."""
    df = pd.read_csv(PATH_TO_PLANS)
    df = df[df.IssuerId.astype(str) == issuer]
    return set(df.StandardComponentId.unique())


def extract_plans(state):
    """
    Extract issuer ids and URLs from the puf file.

    Returns list of tuples of (plan name, plan url)
    """
    df = pd.read_csv(PATH_TO_PUFS)
    df = df[df.State == state]
    return list(zip(df['Issuer ID'].astype(str), df['URL Submitted']))


def fetch_provider_urls(plan_url):
    """Fetch all provider urls listed on a plan's url."""
    response = requests.get(plan_url)
    response.raise_for_status()
    response_json = response.json()
    if 'provider_urls' in response_json:
        return response_json['provider_urls']
    logging.warning('No provider URLs available for plan url: {}'.format(plan_url))


def clean_paths(url):
    """Translate urls into human-readable filenames."""
    to_remove = ['http://', 'https://', 'www.', '.com', '.json', '.']
    for item in to_remove:
        url = url.replace(item, '')

    return url.replace('/', '_')


def clean_plan_name(plan_name):
    """Standardize plan name."""
    return str.lower(plan_name.replace(' ', '_'))


def query_yes_no(message, default='y'):
    """Query user for yes/no choide."""
    choices = 'Y/n' if default.lower() in ('y', 'yes') else 'y/N'
    choice = str(input('%s (%s) ' % (message, choices)))
    values = ('y', 'yes', '') if choices == 'Y/n' else ('y', 'yes')
    return choice.strip().lower() in values

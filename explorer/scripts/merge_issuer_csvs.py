"""
Manual script for merging csvs into one large CSV per state with plan info.

FIXME: Incorporate this into a script with arguments.
"""
import gc

import logging

import pandas as pd


logging.basicConfig(level=logging.INFO)

HEALTHCARE_GOV_PATH = '/home/jovyan/work/data/healthcare_gov'
state = 'FL'

# Hard coded due to lack of Company info in Machine Readable PUF.
# TODO: Automate this dictionary creation.
issuer_dict = {
    '16842': 'BCBS',
    '21663': 'Celtic/Ambetter',
    '30252': '30252',
    '36194': '36194',
    '43274': '43274',
    '48129': '48129',
    '54172': 'Molina',
    '56503': '56503',
    '93299': '93299',
    '98869': '98869',
}

csvs = [HEALTHCARE_GOV_PATH + '/{}/{}.csv'.format(state, issuer) for issuer in issuer_dict.keys()]
logging.info('CSVs being read in: {}'.format(csvs))
dfs = [pd.read_csv(csv) for csv in csvs]


for issuer_id, df in zip(issuer_dict.keys(), dfs):
    df['IssuerId'] = int(issuer_id)
    df['CompanyName'] = issuer_dict[issuer_id]

logging.info('{} provider dataframes loaded in'.format(len(dfs)))

plans = pd.read_csv(HEALTHCARE_GOV_PATH + '/Plan_Attributes_PUF.csv')
plans = plans[plans.StateCode == state]
# Reduce the number of columns in the plans data.
plans = plans[[
    'BusinessYear',
    'StateCode',
    'IssuerId',
    'SourceName',
    'ImportDate',
    'MarketCoverage',
    'DentalOnlyPlan',
    'TIN',
    'StandardComponentId',
    'PlanMarketingName',
    'HIOSProductId',
    'HPID',
    'NetworkId',
    'ServiceAreaId',
    'FormularyId',
    'IsNewPlan',
    'PlanType',
    'MetalLevel',
    'DesignType',
    'UniquePlanDesign',
    'QHPNonQHPTypeId',
    'PlanEffectiveDate',
    'PlanExpirationDate',
    'NationalNetwork',
    'FormularyURL',
    'PlanId',
    'PlanVariantMarketingName',
    'CSRVariationType'
]]
# Reduce to 1 line per Standard Component Id (a.k.a plan_id in provider file).
plans.drop_duplicates(subset=['StandardComponentId'], inplace=True)
plans = plans[plans.DentalOnlyPlan == 'No']
logging.info('Number of rows in plans df: {}'.format(plans.shape[0]))

in_state_plan_ids = set(plans.StandardComponentId)

all_the_plans = pd.concat(dfs)
logging.info('Lines in concatenated provider dataframes: {}'.format(all_the_plans.shape[0]))
all_the_plans = all_the_plans[all_the_plans.Plan_Id.isin(in_state_plan_ids)]
logging.info('Lines in concatenated provider dataframes (in-state): {}'.format(
    all_the_plans.shape[0]))

# Reduce memory consumption.
del dfs
gc.collect()

# Join Plan and Provider dataframes.
logging.info('Joining plan and provider dataframes...')
merged = pd.merge(
    all_the_plans, plans, how='left', left_on='Plan_Id', right_on='StandardComponentId')
logging.info('Joining complete!')
logging.info('Number of lines in the final merged dataframe: {}'.format(merged.shape[0]))

del all_the_plans
gc.collect()

target_path = 'HEALTHCARE_GOV_PATH/all_of_{}.csv'.format(state)
merged.to_csv(target_path, index=False)
logging.info('{} lines of data for {} written to csv'.format(merged.shape[0], state))

"""
Manual script for merging csvs into 1 large csv per state with plan info.

TODO: Incorporate this into a script with arguments.
"""
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)

HEALTHCARE_GOV_PATH = '/home/jovyan/work/data/healthcare_gov'

state = 'MO'

# Hard coded due to lack of Company info in Machine Readable PUF.
# TODO: Automate this dictionary creation.
issuer_dict = {'29416': 'BestLife', '32753': 'Anthem', '74483': 'Cigna'}

csvs = [HEALTHCARE_GOV_PATH + '/{}/{}.csv'.format(state, issuer) for issuer in issuer_dict.keys()]
logging.info('Csvs being read in: {}'.format(csvs))
dfs = [pd.read_csv(csv) for csv in csvs]


for issuer_id, df in zip(issuer_dict.keys(), dfs):
    df['IssuerId'] = int(issuer_id)
    df['CompanyName'] = issuer_dict[issuer_id]
logging.info('{} provider dataframes loaded in'.format(len(dfs)))

plans = pd.read_csv(HEALTHCARE_GOV_PATH + '/Plan_Attributes_PUF.csv')

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

plans = plans[plans.StateCode == state]
# Reduce to 1 line per Standard Component Id (a.k.a plan_id in provider file).
plans.drop_duplicates(subset=['StandardComponentId'], inplace=True)
plans = plans[plans.DentalOnlyPlan == 'No']
logging.info('Number of rows in plans df: {}'.format(plans.size))

in_state_plan_ids = set(plans.StandardComponentId.unique())

all_the_plans = pd.concat(dfs)
logging.info('Number of lines in joined provider dataframes: {}'.format(all_the_plans.size))
all_the_plans = all_the_plans[all_the_plans.Plan_Id.isin(in_state_plan_ids)]

# Reduce memory consumption
del dfs

# Join Plan and Provider dataframes.
logging.info('Joining plan and provider dataframes...')
merged = pd.merge(
    all_the_plans, plans, how='left', left_on='Plan_Id', right_on='StandardComponentId')
logging.info('Joining complete!')
logging.info('Number of lines in the final merged dataframe: {}'.format(merged.size))

del all_the_plans

merged.to_csv('all_of_{}.csv'.format(state), index=False)
logging.info('{} lines of data for {} written to csv'.format(merged.size, state))

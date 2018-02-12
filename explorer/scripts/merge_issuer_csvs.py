"""
Manual script for merging csvs into 1 large csv per state with plan info.

TODO: Incorporate this into a script with arguments.
"""
import pandas as pd

HEALTHCARE_GOV_PATH = '/home/jovyan/work/data/healthcare_gov'

state = 'MO'

# Hard coded due to lack of Company info in Machine Readable PUF.
# TODO: Automate this dictionary creation.
issuer_dict = {'29416': 'BestLife', '32753': 'Anthem', '74483': 'Cigna'}

csvs = [HEALTHCARE_GOV_PATH + '/{}/{}.csv'.format(state, issuer) for issuer in issuer_dict.keys()]
dfs = [pd.read_csv(csv) for csv in csvs]

print(csvs)

for issuer_id, df in zip(issuer_dict.keys(), dfs):
    df['IssuerId'] = int(issuer_id)
    df['CompanyName'] = issuer_dict[issuer_id]

print(dfs[0].head())

print(len(dfs))

plans = pd.read_csv(HEALTHCARE_GOV_PATH + '/Plan_Attributes_PUF.csv')
print(plans.info())

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
plans.drop_duplicates(subset=['StandardComponentId'], inplace=True)
plans = plans[plans.DentalOnlyPlan == 'No']
print(plans.info())

in_state_plan_ids = set(plans.StandardComponentId.unique())

all_the_plans = pd.concat(dfs)
all_the_plans.info()
all_the_plans = all_the_plans[all_the_plans.Plan_Id.isin(in_state_plan_ids)]
print(all_the_plans.info())

del dfs

# Join Plan and Provider dataframes.
print('joining....')
merged = pd.merge(
    all_the_plans, plans, how='left', left_on='Plan_Id', right_on='StandardComponentId')
print('joined!')
del all_the_plans
print(merged.info())

merged.to_csv('all_of_{}.csv'.format(state), index=False)

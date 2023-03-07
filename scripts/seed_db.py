import pandas as pd
import json
import os
import tqdm
import requests

official_dtypes = {'precinct':str,'office':str, 'party_detailed':str,
'party_simplified':str,'mode':str,'votes':int, 'county_name':str,
'county_fips':str, 'jurisdiction_name':str,'jurisdiction_fips':str,
'candidate':str, 'district':str, 'dataverse':str,'year':int,
'stage':str, 'state':str, 'special':str, 'writein':str, 'state_po':str,
'state_fips':str, 'state_cen':str, 'state_ic':str, 'date':str,
'readme_check':str,'magnitude':int}


def process(row):
    print(row)
    
    

if __name__ == '__main__':
    
    # Download from google drive
    # Configure this path to work for you
    df = pd.read_csv("~/huskies-416-project/data/HOUSE_precinct_general.csv", 
                     usecols=['party_simplified', 'votes', 'district', 'jurisdiction_name', 'jurisdiction_fips', 'state', 'candidate', 'state_fips' ], 
                     dtype=official_dtypes)
    df = df[df['state'].str.contains("GEORGIA|NEW YORK|ILLINOIS") == True]


    with tqdm.tqdm(total=len(df)) as progress_bar:
        for row in df.itertuples():
            payload = {
                "plan": "GA2020",
                "candidate": row.candidate,
                "district": row.district,
                "state": row.state_fips,
                "party": (lambda x: x if x in ['DEMOCRAT', 'REPUBLICAN'] else 'INDEPENDANT')(row.party_simplified),
                "votes": row.votes,
                "precinct": row.jurisdiction_fips
            }
            print(payload)
            r = requests.patch('http://localhost:8080/api/precinct', json=payload)
            progress_bar.update(1)
        
#pip install in the following order: numpy, pandas, shapely, fiona, pyproj, packaging, geopandas
import pandas as pd
import geopandas as gpd
import numpy as np
#reading boundary data, filter out name, geoid, and geometry
pth = './data/NY/ny_vtd_2020_bound.shp'
gdf = gpd.read_file(pth)
gdf = gdf[['NAME20','GEOID20','geometry']]
#reading election data, filter out geoid, votes for Trump and Biden
edata = pd.read_csv("./data/NY/ny_2020_2020_vtd.csv")
edata = edata[['GEOID20','R_2020_pres','D_2020_pres']]
#reading census data, filter out geoid, area, coordinates, demographic data
ddata = pd.read_csv("./data/NY/ny_pl2020_vtd.csv")
ddata = ddata[['GEOID20','TOTAL_VAP_ADJ','WHITE_VAP_ADJ','BLACK_VAP_ADJ','AMIND_VAP_ADJ','ASIAN_VAP_ADJ','HWN_VAP_ADJ','OTHER_VAP_ADJ','MULTI_VAP_ADJ','HISP_VAP_ADJ']]
#merging data sets on GEOID20
gdf['GEOID20']=gdf['GEOID20'].astype(np.int64)
gdf  = edata.merge(gdf, on='GEOID20', how='left')
gdf  = ddata.merge(gdf, on='GEOID20', how='left')

#convert dataframe to geojson
gdf = gdf.rename(columns={'R_2020_pres': '2020VTRUMP', 'D_2020_pres': '2020VBIDEN', 'TOTAL_VAP_ADJ':'VAPTOTAL', 'WHITE_VAP_ADJ':'VAPWHITE', 'BLACK_VAP_ADJ':'VAPBLACK','AMIND_VAP_ADJ':'VAPINAMORAK','ASIAN_VAP_ADJ':'VAPASIAN','HWN_VAP_ADJ':'VAPISLAND','OTHER_VAP_ADJ':'VAPOTHER','MULTI_VAP_ADJ':'VAPMIXED','HISP_VAP_ADJ':'VAPHISP'})
gdf = gpd.GeoDataFrame(gdf, geometry='geometry')

gdf.to_file('mergedNY.geojson', driver='GeoJSON')
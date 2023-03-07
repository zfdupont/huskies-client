#pip install in the following order: numpy, pandas, shapely, fiona, pyproj, packaging, geopandas
import pandas as pd
import geopandas as gpd
#reading boundary data, filter out name, geoid, and geometry
pth = './data/GA/ga_vtd_2020_bound.shp'
gdf = gpd.read_file(pth)
gdf = gdf[['NAME20','GEOID20','geometry']]
#reading election data, filter out geoid, votes for Trump and Biden
edata = pd.read_csv("./data/GA/ga_2020_2020_vtd.csv")
edata = edata[['GEOID20','G20PRERTRU','G20PREDBID']]
#reading census data, filter out geoid, area, coordinates, demographic data
ddata = pd.read_csv("./data/GA/ga_pl2020_vtd.csv")
ddata = ddata[['GEOID20','P0030001','P0030003','P0030004','P0030005','P0030006','P0030007','P0030008','P0030009','P0040002']]
#merging data sets on GEOID20
gdf  = edata.merge(gdf, on='GEOID20', how='left')
gdf  = ddata.merge(gdf, on='GEOID20', how='left')
#store as geojson
gdf = gdf.rename(columns={'G20PRERTRU': '2020VTRUMP', 'G20PREDBID': '2020VBIDEN', 'P0030001':'VAPTOTAL', 'P0030003':'VAPWHITE', 'P0030004':'VAPBLACK','P0030005':'VAPINAMORAK','P0030006':'VAPASIAN','P0030007':'VAPISLAND','P0030008':'VAPOTHER','P0030009':'VAPMIXED','P0040002':'VAPHISP'})
gdf = gpd.GeoDataFrame(gdf, geometry='geometry')

gdf.to_file('mergedGA.geojson', driver='GeoJSON')
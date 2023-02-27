#pip install in the following order: numpy, pandas, shapely, fiona, pyproj, packaging, geopandas
import pandas as pd
import geopandas as gpd
pth = './data/ga_vtd_2020_bound.shp'
gdf = gpd.read_file(pth)
tdata = pd.read_csv("./data/ga_pl2020_vtd.csv")
gdf = gdf[['VTDST20','GEOID20','geometry', 'NAME20']]
df  = tdata.merge(gdf, on='GEOID20', how='left')
df = gpd.GeoDataFrame(df, geometry='geometry')
df.to_file('./merged/mergeGA.shp') 
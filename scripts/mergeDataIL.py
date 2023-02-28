#pip install in the following order: numpy, pandas, shapely, fiona, pyproj, packaging, geopandas
import pandas as pd
import geopandas as gpd
pth = './data/il_vtd_2020_bound.shp'
gdf = gpd.read_file(pth)
tdata = pd.read_csv("./data/il_pl2020_vtd.csv").astype(str)

gdf = gdf[['VTDST20','GEOID20','geometry', 'NAME20']]
gdf  = tdata.merge(gdf, on='GEOID20', how='left')
gdf = gpd.GeoDataFrame(gdf, geometry='geometry')
gdf.to_file('dataframe.geojson', driver='GeoJSON')
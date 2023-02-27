#pip install in the following order: numpy, pandas, shapely, fiona, pyproj, packaging, geopandas
import pandas as pd
import geopandas as gpd
pth = './data/ga_vtd_2020_bound.shp'
df = gpd.read_file(pth)
tdata = pd.read_csv("./data/ga_pl2020_vtd.csv")
edata = pd.read_csv("./data/ga_2022_gen_prec.csv")
filterList = [-1]
for i in range(36,64):
  filterList.append(i)
edata = edata.iloc[:, filterList]
df = df[['VTDST20','GEOID20','geometry', 'NAME20']]
df2  = tdata.merge(df, on='GEOID20', how='left')
df2 = gpd.GeoDataFrame(df2, geometry='geometry')
df2.to_file('dataframe.geojson', driver='GeoJSON')
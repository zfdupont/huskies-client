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
ddata = ddata[['GEOID20','AREALAND','AREAWATR','INTPTLAT','INTPTLON','P0010001','P0010002','P0010003','P0010004','P0010005','P0010006','P0010007','P0010008','P0020002','P0020003']]
#merging data sets on GEOID20
gdf  = edata.merge(gdf, on='GEOID20', how='left')
gdf  = ddata.merge(gdf, on='GEOID20', how='left')
#convert to geoJSON
gdf = gpd.GeoDataFrame(gdf, geometry='geometry')
gdf.to_file('precinctDataGA.geojson', driver='GeoJSON')
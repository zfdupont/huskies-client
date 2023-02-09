# source: http://geospatialpython.com/2013/07/shapefile-to-geojson.html

import shapefile
from json import dumps
import os
import sys

if __name__ == '__main__':
    # read the shapefile
    absolute_path = os.path.dirname(__file__)
    full_path = os.path.join(os.path.dirname(absolute_path), "data/ny_final.shp")

    reader = shapefile.Reader(full_path)
    fields = reader.fields[1:]
    field_names = [field[0] for field in fields]
    buffer = []
    for sr in reader.shapeRecords():
        atr = dict(zip(field_names, sr.record))
        geom = sr.shape.__geo_interface__
        buffer.append(dict(type="Feature", geometry=geom, properties=atr)) 

    # write the GeoJSON file
    geojson = open(os.path.join(os.path.dirname(absolute_path), "data/shape.json"), "w")
    geojson.write(dumps({"type": "FeatureCollection", "features": buffer}, indent=2) + "\n")
    geojson.close()

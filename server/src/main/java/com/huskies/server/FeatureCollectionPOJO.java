package com.huskies.server;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.CoordinateXY;
import org.locationtech.jts.geom.MultiPolygon;
import org.locationtech.jts.geom.Polygon;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import java.util.*;

class GeometryPOJO {
    public String type;
    public List<Double[]> coordinates;

    public GeometryPOJO(Object g) {
        this.coordinates = new ArrayList<>();
        if(g instanceof MultiPolygon){
            this.type = "MultiPolygon";
            MultiPolygon geo = (MultiPolygon) g;
            for(Coordinate xy : geo.getCoordinates()){
                this.coordinates.add(new Double[]{xy.x, xy.y});
            }
        } else {
            this.type = "Polygon";
            Polygon geo = (Polygon) g;
            for(Coordinate xy : geo.getCoordinates()){
                this.coordinates.add(new Double[]{xy.x, xy.y});
            }
        }
//        this.coordinates = new ArrayList<>(coordinates);
    }
}
class FeaturePOJO {
    public String type;
    public GeometryPOJO geometry;
    public Map<String, Object> properties;

    public FeaturePOJO(SimpleFeature feature) {
        this.type = "Feature";
        Object g = feature.getDefaultGeometry();
        this.geometry = new GeometryPOJO(g);
        Collection<Object> p = feature.getAttributes();
        this.properties = new HashMap<>();
    }
}
public class FeatureCollectionPOJO {
    public String type;
    public List<FeaturePOJO> features;
    public FeatureCollectionPOJO(FeatureCollection<SimpleFeatureType, SimpleFeature> collection) {
        this.type = "FeatureCollection";
        this.features = new ArrayList<FeaturePOJO>();
        FeatureIterator<SimpleFeature> it = collection.features();
        while(it.hasNext()){
            SimpleFeature feature = it.next();
            FeaturePOJO f = new FeaturePOJO(feature);
            this.features.add(f);
        }
    }

    @Override
    public String toString() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}

import React, { useEffect } from 'react';
import {MapContainer, useMap} from 'react-leaflet';
import L from "leaflet";
import NY from '../../0.data/NY.json'

const Map = () => {
    const geojsonData = NY;

    // Add the TileLayer after the GeoJSON layers have been added to the map
    const addTileLayerToMap = (map) => {
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            zIndex: 1
        }).addTo(map);
    };

    const MapComponent = () => {
        const map = useMap();
        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        // Add the GeoJSON layers to the map
        useEffect(() => {

            // const geojsonLayer2 = L.geoJSON(geojsonData).addTo(map);
            const geojsonLayer1 = L.geoJSON(geojsonData).addTo(map);

            // Add the TileLayer after the GeoJSON layers have been added
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                pane: 'labels',
            }).addTo(map);


            // Return a cleanup function to remove the GeoJSON layers when the component unmounts
            return () => {
                map.removeLayer(geojsonLayer1);
            };
        }, [map]);

        return null;
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13}>
            <MapComponent />
        </MapContainer>
    );
};

export default Map;

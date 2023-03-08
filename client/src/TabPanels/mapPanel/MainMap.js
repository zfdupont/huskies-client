import {GeoJSON, MapContainer, TileLayer, useMap} from "react-leaflet";
import * as React from "react";
import MapController from "./MapController";
import MapProperty from './MapProperty.json';
export default function MainMap()
{
    return (
        <div className="map" style={{flex:3.5, marginRight: '10px'}}>
            <MapContainer id='map-container' center={[40.35, -97.5]} zoom={4.3} scrollWheelZoom={true}>
                <MapController/>
            </MapContainer>
        </div>
    )
}
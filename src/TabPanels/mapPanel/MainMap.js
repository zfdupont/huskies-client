import {GeoJSON, MapContainer, TileLayer, useMap} from "react-leaflet";
import * as React from "react";
import MapController from "./MapController";
import MapProperty from './MapProperty.json';
export default function MainMap()
{
    return (
        <MapContainer id='map-container' center={[40.35, -97.5]} zoom={4.3} scrollWheelZoom={true}>
            <MapController/>
        </MapContainer>
    )
}
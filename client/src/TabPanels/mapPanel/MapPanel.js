import * as React from "react";
import {MapContainer, GeoJSON, TileLayer, useMap, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import MainMap from "./MainMap";
import MapSideInfo from "./MapSideInfo";

export default function MapPanel()
{
    console.log("MapPanel");
    return (
        <div style={{position:'absolute', width:'100%', height:'100%', backgroundColor:'lightgray'}}>
            <div className='map-content-area' style={{display:'flex', margin: '10px'}}>
                <MainMap/>
                <MapSideInfo/>
            </div>
        </div>
    );
}
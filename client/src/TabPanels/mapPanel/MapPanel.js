import * as React from "react";
import {MapContainer, GeoJSON, TileLayer, useMap, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import MainMap from "./MainMap";
import MapSideInfo from "./MapSideInfo";
import MapTest from "./MapTest";

export default function MapPanel()
{
    console.log("MapPanel");
    return (
        <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 20px)', padding: '10px', display:'flex'}}>
            <MainMap/>
            <MapSideInfo/>
        </div>
    );
}
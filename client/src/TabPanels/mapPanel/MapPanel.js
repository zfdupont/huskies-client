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
        <div>
            <div className='map-content-area' style={{display:'flex', margin: '10px'}}>
                <MainMap/>
                {/*<MapTest></MapTest>*/}
                <MapSideInfo/>
            </div>
        </div>
    );
}
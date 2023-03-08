import * as React from "react";
import 'leaflet/dist/leaflet.css'
import MainMap from "./MainMap";
import MapSideInfo from "./MapSideInfo";

export default function MapPanel()
{
    console.log("MapPanel");
    return (
        <div>
            <div className='map-content-area' style={{display:'flex', margin: '10px', backgroundColor:'gray'}}>
                <MainMap/>
                <MapSideInfo/>
            </div>
        </div>
    );
}
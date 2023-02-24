import {MapContainer, TileLayer} from "react-leaflet";
import * as React from "react";

export default function MainMap()
{
    return (
        <div className="map" style={{flex:3.5, marginRight: '10px'}}>
            <MapContainer center={[52.51, 13.38]} zoom={6} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    )
}
import React from 'react';
import {MapContainer, GeoJSON, TileLayer, Marker, Popup} from 'react-leaflet';

export default function Map(props){
    let position = [39.8283, -98.5795];
    return (
        <div id='map'>
            <MapContainer center={position} zoom={5} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}
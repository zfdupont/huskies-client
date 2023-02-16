import React, { useEffect } from 'react';
import L from 'leaflet';
import GAD from './data/GAD.json';
import ILD from './data/ILD.json';
import NYD from './data/NYD.json';
import {MapContainer, GeoJSON, TileLayer, Marker, Popup, useMap} from 'react-leaflet';


function getJsonByName(name) {
    let id = '';
    switch(name){
        case 'Georgia':
            return GAD;
        case 'Illinois':
            return ILD;
        case 'New York':
            return NYD;
    }
}

function FlyMapTo(props){
    const map = useMap();
    if (props.state){
        const json = getJsonByName(props.state);
        console.log(json);
        var layer = new L.geoJSON(json);
    }
    
    useEffect(() => {
        map.flyTo(props.position, props.zoom);
        if(props.state) {
            let currLayer = null;
            map.eachLayer((l) => {
                if(l instanceof L.GeoJSON)
                    currLayer = l;
            });
            if(currLayer) map.removeLayer(currLayer);
            map.addLayer(layer);
        }
    });
    return null;
}

export default function Map(props){
    let position = [39.8283, -98.5795];
    let zoom = 5;
    switch (props.state) {
        case 'Georgia':
            zoom = 6;
            position = [32.428, -83.297];
            break;
        case 'Illinois':
            zoom = 6;
            position = [40.08, -89.184];
            break;
        case 'New York':
            zoom = 6;
            position = [42.579, -76.10];
            break;
        default:
            break;
    }
    console.log(position);
    return (
        <div id='map'>
            <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyMapTo position={position} zoom={zoom} state={props.state}/>
            </MapContainer>
        </div>
    );
}
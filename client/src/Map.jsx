import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import GA from './data/GA.json';
import IL from './data/IL.json';
import NY from './data/NY.json';
import GAD from './data/GAD.json';
import ILD from './data/ILD.json';
import NYD from './data/NYD.json';
import {MapContainer, GeoJSON, TileLayer, useMap} from 'react-leaflet';


const nameToPlan = {
    'Georgia': new L.GeoJSON(GAD),
    'Illinois': new L.GeoJSON(ILD),
    'New York': new L.GeoJSON(NYD),

}

function FlyMapTo(props){
    const map = useMap();
    
    useEffect(() => {
        map.flyTo(props.position, props.zoom);
    });
    return null;
}
function ShowDistrictMap(props){
    const map = useMap();
    useEffect(() => {
        ['Georgia', 'Illinois', 'New York'].forEach(e => {
            // console.log(e, props.state, map.hasLayer(nameToPlan[e]));
            if(e !== props.state) {
                map.removeLayer(nameToPlan[e]);
            }
            else{
                console.log(e, props.state, e !== props.state) 
                map.addLayer(nameToPlan[e])
            };
        });;
    });
}

export default function DistMap(props){
    const [state, setState] = useState(props.state);
    useEffect(() => {
        setState(props.state);
    }, [props.state]);
    
    let position;
    let zoom;
    switch (state) {
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
            zoom = 5;
            position = [39.8283, -98.5795];
            break;
    } 
    console.log(state);
    return (
        <div id='map'>
            <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={GA} onEachFeature={(feature, layer) => {
                    layer.on('click', () => setState('Georgia'));
                }}></GeoJSON>
                <GeoJSON data={IL} onEachFeature={(feature, layer) => {
                    layer.on('click', () => setState('Illinois'));
                }}></GeoJSON>
                <GeoJSON data={NY} onEachFeature={(feature, layer) => {
                    layer.on('click', () => setState('New York'));
                }}></GeoJSON>
                <FlyMapTo position={position} zoom={zoom} />
                <ShowDistrictMap state={state}/> 

            </MapContainer>
        </div>
    );
}
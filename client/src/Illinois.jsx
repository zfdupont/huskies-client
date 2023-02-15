import React from 'react';
import ILD from './data/ILD.json';
import {MapContainer, GeoJSON} from 'react-leaflet';
export default class Illinois extends React.Component{
    disStyle = {
        fillColor: "green",
        fillOpacity: 0.5,
        color: "black",
        weight: 2
    };
    render() {
        return(
            <div>
                <MapContainer center={[40, -89.4]} zoom={6}>
                    <GeoJSON style = {this.disStyle} data={ILD.features}/>
                </MapContainer>
            </div>
        )
    }
}
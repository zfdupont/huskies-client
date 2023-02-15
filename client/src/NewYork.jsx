import React from 'react';
import NYD from './data/NYD.json';
import {MapContainer, GeoJSON} from 'react-leaflet';
export default class NewYork extends React.Component{
    disStyle = {
        fillColor: "green",
        fillOpacity: 0.5,
        color: "black",
        weight: 2
    };
    render() {
        return(
            <div>
                <MapContainer center={[42.8, -76]} zoom={6}>
                    <GeoJSON style = {this.disStyle} data={NYD.features}/>
                </MapContainer>
            </div>
        )
    }
}
import React from 'react';
import GAD from './data/GAD.json';
import {MapContainer, GeoJSON} from 'react-leaflet';
export default class Georgia extends React.Component{
    disStyle = {
        fillColor: "green",
        fillOpacity: 0.5,
        color: "black",
        weight: 2
    };
    render() {
        return(
            <div>
                <MapContainer center={[32.8, -83]} zoom={6}>
                    <GeoJSON style = {this.disStyle} data={GAD.features}/>
                </MapContainer>
            </div>
        )
    }
}
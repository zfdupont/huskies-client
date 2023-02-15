import React from 'react';
import shape from './data/shape.json';
import {MapContainer, GeoJSON} from 'react-leaflet';
import Bar from './bar';
export default class NewYork extends React.Component{
    render() {
        return(
            <div>
                <MapContainer center={[42.8, -76]} zoom={6}>
                    <GeoJSON style = {this.mapStyle} data={shape.features}/>
                </MapContainer>
                <div>
                    <Bar></Bar>
                </div>
            </div>
        )
    }
}
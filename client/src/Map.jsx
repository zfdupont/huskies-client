import React from 'react';
import states from './data/states.json';
import NY from './data/NY.json';
import GA from './data/GA.json';
import IL from './data/IL.json';
import {MapContainer, GeoJSON} from 'react-leaflet';
export default class Map extends React.Component{
	constructor(props) {
		super(props);
        this.stateSelect = this.stateSelect.bind(this);
        this.selectNY = this.selectNY.bind(this);
    }
    mapStyle = {
        fillColor: "yellow",
        color: "black",
        weight: 2
    };
    stateStyle = {
        fillColor: "green",
        fillOpacity: 0.5,
        color: "black",
        weight: 2
    };
    selectNY() {
        this.props.handlePage("NY");
    }
    stateSelect() {
        document.getElementById("dropdown").classList.toggle("show");
    };
    render() {
        return(
            <div>
                <MapContainer center={[37.4316, -78.6569]} zoom={4}>
                    <GeoJSON style = {this.stateStyle} data={NY.geometry}/>
                    <GeoJSON style = {this.stateStyle} data={GA.geometry}/>
                    <GeoJSON style = {this.stateStyle} data={IL.geometry}/>
                    <GeoJSON style = {this.mapStyle} data={states.features}/>
                </MapContainer>
                <button onClick = {this.stateSelect}>Select State</button>
                <div id = "dropdown" class = "dropdown_states">
                    <a href="#" onClick = {this.selectNY}>New York</a>
                    <a href="#">Georgia</a>
                    <a href="#">Illinois</a>
                </div>
            </div>
        )
    }
}
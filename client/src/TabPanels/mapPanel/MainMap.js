import {GeoJSON, MapContainer, TileLayer, useMap} from "react-leaflet";
import L from 'leaflet';
import * as React from "react";
import NY from '../../0.data/NY.json'
import GA from '../../0.data/GA.json'
import IL from '../../0.data/IL.json'
import US from '../../0.data/US.json'

function MapSetup()
{
    const map = useMap();

    const bounds = [
        [55, -66], // [west, south]
        [17, -130]  // [east, north]
    ];

    map.on('moveend', function(e) {
        console.log(map.getBounds());
    });
    map.setMaxBounds(bounds);
    map.setMaxZoom(10);
    map.setMinZoom(4.3);
    L.geoJSON(NY).addTo(map);
    L.geoJSON(GA).addTo(map);
    L.geoJSON(IL).addTo(map);
}



export default function MainMap()
{

    return (
        <div className="map" style={{flex:3.5, marginRight: '10px'}}>
            <MapContainer center={[40.35, -97.5]} zoom={4.3} scrollWheelZoom={true}>
                <TileLayer
                    url="https://api.mapbox.com/styles/v1/yongshn220/clejftlgu000201nls5ye4hwe/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieW9uZ3NobjIyMCIsImEiOiJjbGVqZnp1Z2kwMTRvNDFycmg1Z2RveGdtIn0.QUuLGb1Uu6Pl6OF0YJO--A"
                    attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                />
                <MapSetup/>
            </MapContainer>
        </div>
    )
}

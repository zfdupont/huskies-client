import {GeoJSON, MapContainer, TileLayer, useMap} from "react-leaflet";
import L from 'leaflet';
import * as React from "react";
import { useState, useContext, useEffect } from 'react';
import NY from '../../0.data/NY.json'
import GA from '../../0.data/GA.json'
import IL from '../../0.data/IL.json'
import {StateType, StoreContext} from '../../common/Store'


let currLayerGroups = {};
let layerGroup = null;

function GetGeoJsonByStateType(type)
{
    if (type === StateType.NEWYORK) return NY;
    if (type === StateType.GEORGIA) return GA;
    if (type === StateType.ILLINOIS) return IL;
}
function Test(map)
{
    map.on('moveend', function(e) {
        // console.log(map.getBounds());
    });
}
function DefaultSetup(map)
{
    map.setMaxBounds([[55, -66], [17, -130]]);
    map.setMaxZoom(10);
    map.setMinZoom(4.3);
}

function StateFeature(feature, layer)
{
    layer.on({
        click: () => console.log(feature)
    })
}

function RemoveAllLayer()
{
    const LayerGroupProperties = Object.keys(currLayerGroups);
    LayerGroupProperties.forEach((prop) => {
        currLayerGroups[prop].clearLayers();
    })
}

function SetCountryView(map)
{
    RemoveAllLayer();
    let stateData = [NY, GA, IL];
    let layerGroup = L.layerGroup().addTo(map);
    stateData.forEach((data) => {
        let newLayer = L.geoJSON(data, {
            onEachFeature: StateFeature
        }).addTo(layerGroup);
    });
    currLayerGroups.countryView = layerGroup;
}

function SetStateView(map, stateType)
{
    RemoveAllLayer();
    let layerGroup = L.layerGroup().addTo(map);
    let data = GetGeoJsonByStateType(stateType);
    L.geoJSON(data).addTo(layerGroup);
    currLayerGroups.stateView =layerGroup;
}

export default function MainMap()
{
    const { store } = useContext(StoreContext);
    function MapSetup()
    {
        const map = useMap();
        DefaultSetup(map);
        if (store.map.state === null)
            SetCountryView(map);
        else
            SetStateView(map, store.map.state);
    }

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

import {useContext, useEffect, useRef, useState} from "react";
import L from "leaflet";
import StoreContext, {StateType} from '../../common/Store';
import {useMap} from "react-leaflet";
import NY from "../../0.data/NY.json";
import GA from "../../0.data/GA.json";
import IL from "../../0.data/IL.json";


let currLayerGroups = {};

export default function MapController()
{
    const { store } = useContext(StoreContext);
    const map = useMap();
    Main();
    function Main()
    {
        DefaultSetup();
        ViewSetup();
    }
    // --- INIT SETUP ------------------------
    function DefaultSetup()
    {
        map.setMaxBounds([[55, -66], [17, -130]]);
        map.setMaxZoom(10);
        map.setMinZoom(4.3);
    }
    function ViewSetup()
    {
        if (store.map.state === StateType.NONE)
            SetCountryView();
        else
            SetStateView(store.map.state);
    }
    // --- Event Handler ------------------------
    function StateFeature(feature, layer)
    {
        layer.on({
            click: () => console.log(feature)
        })
    }


    // --- HELPER FUNCTIONS -----------------
    function GetGeoJsonByStateType(type)
    {
        if (type === StateType.NEWYORK) return NY;
        if (type === StateType.GEORGIA) return GA;
        if (type === StateType.ILLINOIS) return IL;
    }
    function RemoveAllLayer()
    {
        const LayerGroupProperties = Object.keys(currLayerGroups);
        LayerGroupProperties.forEach((prop) => {
            currLayerGroups[prop].clearLayers();
        })
    }

    // --- MAP VIEW CONTROLLER. --------------------
    function SetCountryView()
    {
        RemoveAllLayer();
        let stateData = [NY, GA, IL];
        let layerGroup = L.layerGroup().addTo(map);
        stateData.forEach((data) => {
            L.geoJSON(data, {
                onEachFeature: StateFeature
            }).addTo(layerGroup);
        });
        currLayerGroups.countryView = layerGroup;
        SetFocus(StateType.NONE);
    }
    function SetStateView(stateType)
    {
        RemoveAllLayer();
        let layerGroup = L.layerGroup().addTo(map);
        let data = GetGeoJsonByStateType(stateType);
        L.geoJSON(data).addTo(layerGroup);
        currLayerGroups.stateView =layerGroup;
        SetFocus(stateType);
    }

    // --- MAP COLOR CONTROLLER --------------------------
    function AddLayer()
    {

    }

    // --- MAP ZOOM/PIVOT CONTROLLER. --------------------
    function SetFocus(stateType)
    {
        console.log(stateType);
        switch(stateType)
        {
            case StateType.NONE:
                map.flyTo([40.35, -97.5], 4.3); return;
            case StateType.NEWYORK:
                map.flyTo([42.579, -76.10], 6.5); return;
            case StateType.GEORGIA:
                map.flyTo([32.428, -83.297], 6.5); return;
            case StateType.ILLINOIS:
                map.flyTo([40.08, -89.184], 6.5); return;
        }
    }
}

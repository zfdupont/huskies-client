import {useContext, useEffect, useRef, useState} from "react";
import L from "leaflet";
import StoreContext, {StateType} from '../../common/Store';
import {useMap} from "react-leaflet";
import MapProperty from './MapProperty.json';
import {TileLayerType, LayerGroupType, GeoData, StateTypeList} from './MapType';


let currLayerGroups = {};

export default function MapController()
{
    const { store } = useContext(StoreContext);
    const map = useMap();

    // Should be called once.
    useEffect(() => {
        DefaultSetup();
    }, [])

    Main();

    function Main()
    {
        ViewSetup();
    }
    // --- INIT SETUP ------------------------
    function DefaultSetup()
    {
        AddTileLayer(TileLayerType.DEFAULT_WHITE, false);
        map.setMaxBounds(MapProperty.country.default.maxBounds);
        map.setMaxZoom(MapProperty.country.default.maxZoom);
        map.setMinZoom(MapProperty.country.default.minZoom);
    }
    function ViewSetup()
    {
        if (store.map.state === StateType.NONE)
            SetCountryView();
        else
            SetStateView(store.map.state);
    }
    // --- Event Handler ------------------------
    function OnStateClick(stateType)
    {
        store.selectState(stateType);
    }
    // --- HELPER FUNCTIONS -----------------
    function StateTypeToGeoData(type)
    {
        if (type === StateType.NEWYORK) return GeoData.NEWYORK_STATE;
        if (type === StateType.GEORGIA) return GeoData.GEORGIA_STATE;
        if (type === StateType.ILLINOIS) return GeoData.ILLINOIS_STATE;
    }
    function RemoveAllLayer()
    {
        const layerGroupProperties = Object.keys(currLayerGroups);
        console.log(layerGroupProperties);
        layerGroupProperties.forEach((prop) => {
            currLayerGroups[prop].clearLayers();
        })
    }

    // --- MAP VIEW CONTROLLER. --------------------
    function SetCountryView()
    {
        RemoveAllLayer();
        AddCountryDefaultLayer();
        SetFocus(StateType.NONE);
    }
    function SetStateView(stateType)
    {
        RemoveAllLayer();
        AddStateDefaultLayer(stateType);
        SetFocus(stateType);
    }

    // --- MAP COLOR CONTROLLER --------------------------
    function AddCountryDefaultLayer()
    {
        StateTypeList.forEach((stateType) => {
            let option = {
                style: MapProperty.country.style,
                onEachFeature: (feature, layer) => { layer.on('click', () => OnStateClick(stateType)) }
            }
            let geoData = StateTypeToGeoData(stateType);
            AddGeoJsonLayer(geoData, stateType, option);
        })
        AddTileLayer(TileLayerType.PLACE_LABEL, true);
    }

    function AddStateDefaultLayer(stateType)
    {
        let geoData = StateTypeToGeoData(stateType);
        let option = {style: MapProperty.state.style};
        AddGeoJsonLayer(geoData, LayerGroupType.STATE_DEFAULT, option);
        AddTileLayer(TileLayerType.PLACE_LABEL, true);
    }

    function AddTileLayer(layerType, isLayerGroup){
        // only layerGroup is added into LayerGroupList.
        let target = (isLayerGroup)? L.layerGroup().addTo(map) : map;
        if (isLayerGroup) currLayerGroups[layerType] = target;

        L.tileLayer(MapProperty.urls[layerType], {
            pane: 'mapPane'
        }).addTo(target);
    }

    function AddGeoJsonLayer(geoData, layerGroupType, option = {})
    {
        let layerGroup = (currLayerGroups[layerGroupType])? currLayerGroups[layerGroupType] : L.layerGroup().addTo(map);
        if (!currLayerGroups[layerGroupType]) {
            currLayerGroups[layerGroupType] = layerGroup;
        }
        L.geoJSON(geoData, option).addTo(layerGroup);
    }

    // --- MAP ZOOM/PIVOT CONTROLLER. --------------------
    function SetFocus(stateType)
    {
        let flyTo = (stateType === StateType.NONE)? MapProperty.country.flyTo : MapProperty.state[stateType]["flyTo"];
        map.flyTo(flyTo.pos, flyTo.zoom);
    }
}

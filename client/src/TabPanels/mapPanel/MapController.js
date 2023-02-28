import {useContext, useEffect, useRef, useState} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import StoreContext from '../../common/Store';
import MapProperty from './MapProperty.json';
import {TileLayerType, LayerGroupType, GeoData, GeoDataType, StateTypeList, StateType} from '../../common/Enums';


let currLayerGroups = {};

export default function MapController()
{
    const { store } = useContext(StoreContext);
    const [ viewState, setViewState ] = useState(StateType.NONE);
    const map = useMap(); // This is Hooks, not re-rendered.

    useEffect(() => {
        DefaultSetup();
    }, [])

    Main();
    function Main()
    {
        ViewSetup();
    }
    // --- INIT SETUP ---------------------------
    function DefaultSetup()
    {
        AddTileLayer(TileLayerType.DEFAULT_WHITE, false);
        AddTileLayer(TileLayerType.PLACE_LABEL, false);
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
    // --- Event Handler -------------------------
    function OnStateClick(stateType)
    {
        store.selectState(stateType);
    }
    // --- HELPER FUNCTIONS ----------------------

    function RemoveAllLayer()
    {
        const layerGroupProperties = Object.keys(currLayerGroups);
        layerGroupProperties.forEach((prop) => {
            currLayerGroups[prop].clearLayers();
            delete currLayerGroups[prop];
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

    // --- MAP COLOR CONTROLLER ---------------------------
    function AddCountryDefaultLayer()
    {
        StateTypeList.forEach((stateType) => {
            let option = {
                style: MapProperty.country.style,
                onEachFeature: (feature, layer) => { layer.on('click', () => OnStateClick(stateType)) }
            }
            let geoData = GeoData[stateType][GeoDataType.STATE];
            AddGeoJsonLayer(geoData, stateType, option);
        })
        // AddTileLayer(TileLayerType.PLACE_LABEL, true);
    }

    function AddStateDefaultLayer(stateType)
    {
        let option = {
            style: MapProperty.state.style,
            onEachFeature: (feature, layer) => { layer.on('click', () => {
                console.log(feature);
                console.log(layer);
            })}
        };
        // AddGeoJsonLayer(GeoData[stateType][GeoDataType.STATE], LayerGroupType.STATE_DEFAULT, option);
        AddGeoJsonLayer(GeoData[stateType][GeoDataType.DISTRICT], LayerGroupType.STATE_DEFAULT, option);
        // AddTileLayer(TileLayerType.PLACE_LABEL, true);
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
        // If target layerGroup is already in map, add new layer in the group. otherwise, create new.
        let layerGroup = (currLayerGroups[layerGroupType])? currLayerGroups[layerGroupType] : L.layerGroup().addTo(map);
        if (!currLayerGroups[layerGroupType]) {
            currLayerGroups[layerGroupType] = layerGroup;
        }
        L.geoJSON(geoData, option).addTo(layerGroup);
    }

    // --- MAP ZOOM/PIVOT CONTROLLER. --------------------
    function SetFocus(stateType)
    {
        if (viewState === stateType) return;
        let flyTo = (stateType === StateType.NONE)? MapProperty.country.flyTo : MapProperty.state[stateType]["flyTo"];
        map.flyTo(flyTo.pos, flyTo.zoom);
        setViewState(stateType)
    }

    // --- MAP DRAWING FUNCTION --------------------------
    function DrawLayersOnMap()
    {

    }
}

import {useContext, useEffect, useRef, useState} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import StoreContext from '../../common/Store';
import MapProperty from './MapProperty.json';
import {TileLayerType, LayerGroupType, GeoData, GeoDataType, StateTypeList, StateType} from '../../common/Enums';
import geoJsonHelper from '../../common/GeoJsonHelper';
import {filterToLayerGroup, filterToStyle} from "../../common/ConversionHelper";
let currLayerGroups = {};

export default function MapController()
{
    const { store } = useContext(StoreContext);
    const [ viewState, setViewState ] = useState(StateType.NONE);
    const map = useMap(); // This is Hooks, not re-rendered.

    useEffect(() => {
        DefaultSetup();
        return setViewState(StateType.NONE);
    }, [])

    Main();
    function Main()
    {
        RemoveAllLayer();
        FilterSetup();
        ViewSetup();
    }
    // --- SETUP ---------------------------
    function DefaultSetup()
    {
        AddPanes();
        AddTileLayer(TileLayerType.DEFAULT_WHITE, false);
        AddTileLayer(TileLayerType.PLACE_LABEL, false, {pane: TileLayerType.PLACE_LABEL});
        map.setMaxBounds(MapProperty.country.default.maxBounds);
        map.setMaxZoom(MapProperty.country.default.maxZoom);
        map.setMinZoom(MapProperty.country.default.minZoom);
    }
    function AddPanes()
    {
        map.createPane(TileLayerType.PLACE_LABEL);
        map.getPane(TileLayerType.PLACE_LABEL).style.zIndex = 650; // topmost layer under popup.
    }
    function ViewSetup()
    {
        if (store.map.state === StateType.NONE)
            SetCountryView();
        else
            SetStateView(store.map.state);
    }
    function FilterSetup()
    {
        if (store.map.state === StateType.NONE) return;

        store.map.filters.forEach((filterType) => {
            let data = GetFilteredDistrictJson(filterType);
            let layerGroupType = filterToLayerGroup(filterType);
            let option = {style: MapProperty.state[filterToStyle(filterType)]};
            AddGeoJsonLayer(data, layerGroupType, option)
        })
    }
    function GetFilteredDistrictJson(filterType)
    {
        let districtJson = GeoData[store.map.state][GeoDataType.DISTRICT];
        let districtJsonCopy = JSON.parse(JSON.stringify(districtJson)); // deep copy.
        let ids = store.data[store.map.plan][store.map.state];
        ids = ids.getFilteredDistrictsID(filterType);
        return geoJsonHelper.getDistrictJsonByIDs(districtJsonCopy, ids);
    }
    // --- EVENT HANDLER -------------------------
    function OnStateClick(stateType)
    {
        store.selectState(stateType);
    }
    function OnDistrictClick(feature, layer)
    {
        ZoomToLayer(layer);
    }
    function ZoomToLayer(layer)
    {
        let size = GetBoundsSize(layer.getBounds());
        if (size > 250000) { return map.flyTo(layer.getBounds().getCenter(), 7); }
        if (size > 100000) { return map.flyTo(layer.getBounds().getCenter(), 8);}
        if (size > 50000) { return map.flyTo(layer.getBounds().getCenter(), 9);}
        if (size > 30000) { return map.flyTo(layer.getBounds().getCenter(), 10);}
        if (size > 25000) { return map.flyTo(layer.getBounds().getCenter(), 11);}
        if (size > 5000) { return map.flyTo(layer.getBounds().getCenter(), 12);}
        else return 13;
    }
    let GetBoundsSize = (bounds) => bounds.getNorthEast().distanceTo(bounds.getNorthWest());

    // --- HELPER FUNCTIONS ----------------------

    function RemoveAllLayer()
    {
        const layerGroupProperties = Object.keys(currLayerGroups);
        layerGroupProperties.forEach((prop) => {
            let layerGroup = currLayerGroups[prop];
            delete currLayerGroups[prop];
            layerGroup.clearLayers();
        })
    }

    function ApplyMixingValueToStyle(stateType, style)
    {
        // if (stateType === store.getMap)
    }

    // --- MAP VIEW CONTROLLER. --------------------
    function SetCountryView()
    {
        AddCountryDefaultLayer();
        SetFocus(StateType.NONE);
    }
    function SetStateView(stateType)
    {
        console.log("Map controller : state view setup");
        if (!store.isStateDataReady()) return;

        if (store.isPlanSelected())
        {
            AddStateDistrictLayer(store.getMapPlan(), stateType);
        }
        if (store.isSubPlanSelected())
        {
            AddStateDistrictLayer(store.getMapSubPlan(), stateType);
        }
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

    function AddStateDistrictLayer(planType, stateType)
    {
        let option = {
            style: MapProperty.state.style,
            onEachFeature: (feature, layer) => { layer.on('click', () => {
                OnDistrictClick(feature, layer);
            })}
        };
        AddGeoJsonLayer(store.getCurrentStateGeojson(planType), LayerGroupType.STATE_DEFAULT, option);
    }

    function AddTileLayer(layerType, isLayerGroup, option = {}){
        // only layerGroup is added into LayerGroupList.
        let target = (isLayerGroup)? L.layerGroup().addTo(map) : map;
        if (isLayerGroup) currLayerGroups[layerType] = target;
        L.tileLayer(MapProperty.urls[layerType], option).addTo(target);
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
}
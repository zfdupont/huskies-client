import {useCallback, useContext, useEffect, useImperativeHandle, useRef, useState} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import StoreContext from '../../common/Store';
import MapProperty from './MapProperty.json';
import {
    TileLayerType,
    LayerGroupType,
    GeoData,
    GeoDataType,
    StateTypeList,
    StateType,
    RefType, FilterType, PartyType
} from '../../common/Enums';
import geoJsonHelper from '../../common/GeoJsonHelper';
import {filterToLayerGroup, filterToStyle} from "../../common/ConversionHelper";
let currLayerGroups = {};

export default function MapController()
{
    const { storeMap, storeData, callbacks } = useContext(StoreContext);
    const [ viewState, setViewState ] = useState(StateType.NONE);
    const [ highlightDistrictId, setHighlightDistrictId ] = useState(-1);
    const mapControllerRef = useRef(null);
    const map = useMap(); // This is Hooks, not re-rendered.
    const resetStateMap = useCallback(() => {
        setViewState(StateType.NONE);
    }, [])

    useEffect(() => {
        defaultSetup();
        callbacks.addOnResetState(resetStateMap);
        return setViewState(StateType.NONE);
    }, [])

    main();
    function main()
    {
        removeAllLayer();
        colorFilterSetup();
        highlightSetup();
        viewSetup();
    }

    // --- SETUP FUNCTIONS ---------------------------
    function defaultSetup()
    {
        addPanes();
        addTileLayer(TileLayerType.DEFAULT_WHITE, false);
        addTileLayer(TileLayerType.PLACE_LABEL, false, {pane: TileLayerType.PLACE_LABEL});
        map.setMaxBounds(MapProperty.country.default.maxBounds);
        map.setMaxZoom(MapProperty.country.default.maxZoom);
        map.setMinZoom(MapProperty.country.default.minZoom);
    }
    function addPanes()
    {
        map.createPane(TileLayerType.PLACE_LABEL);
        map.getPane(TileLayerType.PLACE_LABEL).style.zIndex = 650; // topmost layer under popup.
    }
    function viewSetup()
    {
        if (storeMap.isStateNone())
            setCountryView();
        else
            setStateView(storeMap.state);
    }
    function colorFilterSetup()
    {
        if (storeMap.isStateNone() || storeMap.colorFilter === FilterType.NONE || !storeData.isReadyToDisplayCurrentMap()) return;

        let geojson = getProcessedGeoJson();
        if (!geojson) return;

        let stateModel = storeData.getStateModelData(storeMap.plan, storeMap.state);
        let colorFilter = storeMap.colorFilter;
        let layerGroupType = filterToLayerGroup(colorFilter);
        let style = MapProperty.state[filterToStyle(colorFilter)];
        const dynamicHeatMapStyle = (feature) => {
            return {...style, color: GetColorByFilter(stateModel, feature.properties.district_id, colorFilter)}
        }
        addGeoJsonLayer(geojson, layerGroupType, {style: dynamicHeatMapStyle})
    }

    function GetColorByFilter(stateModel, districtId, colorFilter)
    {
        return (colorFilter === FilterType.PARTY)? getColorByParty(stateModel, districtId, colorFilter) : getColorPopulation(stateModel, districtId, colorFilter);
    }

    function getColorByParty(stateModel, districtId)
    {
        let data = stateModel.summaryData;
        let party = stateModel.electionDataDict[districtId]?.winnerParty;
        let votes = stateModel.electionDataDict[districtId]?.winnerVotes;
        let min;
        let max;
        let variation;

        if (!validCheck([data,party,votes])) return "#ffffff";

        if (party === PartyType.DEMOCRATIC)
        {
            min = roundDown(data.minDemocrats);
            max = roundUp(data.maxDemocrats);
            variation = roundUp((max - min) / 5);
        }
        else
        {
            min = roundDown(data.minRepublicans);
            max = roundUp(data.maxRepublicans);
            variation = roundUp((max - min) / 5);
        }

        if (votes >= max)               return (party === PartyType.DEMOCRATIC)? "#000077" : "#6b0000";
        if (votes >= min + 4*variation) return (party === PartyType.DEMOCRATIC)? "#0000ff" : "#ff0000";
        if (votes >= min + 3*variation) return (party === PartyType.DEMOCRATIC)? "#2828ff" : "#ff2b2b";
        if (votes >= min + 2*variation) return (party === PartyType.DEMOCRATIC)? "#6767ff" : "#ff6363";
        if (votes >= min + 1*variation) return (party === PartyType.DEMOCRATIC)? "#7e7eff" : "#ff7f7f";
        if (votes >= 0)                 return (party === PartyType.DEMOCRATIC)? "#ababff" : "#fdb4b4";
    }

    function validCheck(list)
    {
        list.forEach((v) => {
            if (!v) return false;
        })
        return true;
    }

    function roundUp(number)
    {
        if (number <= 0) return 0;
        return Math.ceil(number / 10 ** (Math.floor(Math.log10(number)) - 1)) * 10 ** (Math.floor(Math.log10(number)) - 1)
    }
    function roundDown(number)
    {
        if (number <= 0) return 0;
        return Math.floor(number / 10 ** (Math.floor(Math.log10(number)) - 1)) * 10 ** (Math.floor(Math.log10(number)) - 1)
    }

    function getColorPopulation(stateModel, districtId, colorFilter)
    {
        let data = stateModel.summaryData;
        let votes = stateModel.electionDataDict[districtId].getVotesByFilter(colorFilter);
        let min = roundDown(data.getMinByFilter(colorFilter));
        let max = roundUp(data.getMaxByFilter(colorFilter));
        let variation = roundUp((max - min) / 5);

        if (!validCheck([data, votes, min, max, variation])) return "#ffffff";

        if (votes >= max)               return "#00ad00";
        if (votes >= min + 4*variation) return "#00ed01";
        if (votes >= min + 3*variation) return "#3af901";
        if (votes >= min + 2*variation) return "#87fa00";
        if (votes >= min + 1*variation) return "#cefb02";
        if (votes >= 0)                 return "#fefb01";
    }

    function highlightSetup()
    {
        if (
            !storeData.isReadyToDisplayCurrentMap() ||
            storeMap.isStateNone() ||
            storeMap.getHighlightDistrictId() === -1
        ) return;

        let geojson = storeData.getStateGeoJson(storeMap.getMapPlan(), storeMap.getState())
        let selectedDistrictJson = geoJsonHelper.getDistrictJsonByIDs(geojson, [storeMap.getHighlightDistrictId()])
        let option = {style: MapProperty.state["highlight"]}
        let layerGroup = addGeoJsonLayer(selectedDistrictJson, LayerGroupType.HIGHLIGHT, option);
        let innerLayers = layerGroup.getLayers()[0]._layers
        let key = Object.keys(innerLayers)[0];

        if (storeMap.getHighlightDistrictId() !== highlightDistrictId)
        {
            setHighlightDistrictId(storeMap.getHighlightDistrictId());
            zoomToLayer(innerLayers[key])
        }
    }

    function getProcessedGeoJson()
    {
        if (!storeData.isGeojsonReady(storeMap.plan, storeMap.state)) return null;

        let geojson = storeData.getStateGeoJson(storeMap.plan, storeMap.state);

        if (!storeMap.incumbentFilter) return geojson;

        let stateModelData = storeData.getStateModelData(storeMap.plan, storeMap.state);
        let ids = stateModelData.getIncumbentDistrictIDs();
        return geoJsonHelper.getDistrictJsonByIDs(geojson, ids);
    }

    // --- EVENT HANDLER -------------------------
    function OnStateClick(stateType)
    {
        storeMap.selectState(stateType);
        storeData.addStateData(storeMap.plan, stateType);
    }
    function onDistrictClick(feature, layer)
    {
        zoomToLayer(layer);
        storeMap.highlightDistrict(feature.properties.district_id);
    }
    function zoomToLayer(layer)
    {
        if (!layer) return 7;
        let size = getBoundsSize(layer.getBounds());
        if (size > 250000) { return map.flyTo(layer.getBounds().getCenter(), 6);}
        if (size > 100000) { return map.flyTo(layer.getBounds().getCenter(), 7);}
        if (size > 50000) { return map.flyTo(layer.getBounds().getCenter(), 8);}
        if (size > 30000) { return map.flyTo(layer.getBounds().getCenter(), 9);}
        if (size > 25000) { return map.flyTo(layer.getBounds().getCenter(), 10);}
        if (size > 5000) { return map.flyTo(layer.getBounds().getCenter(), 11);}
        else return 12;
    }
    function getBoundsSize(bounds) {
        if (!bounds) return 999999;
        return bounds.getNorthEast().distanceTo(bounds.getNorthWest());
    }

    // --- HELPER FUNCTIONS ----------------------

    function removeAllLayer()
    {
        const layerGroupProperties = Object.keys(currLayerGroups);
        layerGroupProperties.forEach((prop) => {
            let layerGroup = currLayerGroups[prop];
            delete currLayerGroups[prop];
            layerGroup.clearLayers();
        })
    }

    function applyMixingValueToStyle(planType, style, applyFillOpacity = false)
    {
        let styleCopy = JSON.parse(JSON.stringify(style));
        let mValue = storeMap.mixingValue;
        let opacity = (storeMap.getMapPlan() === planType)? (100 - mValue) / 100 : mValue / 100;
        styleCopy.opacity = opacity;
        if (applyFillOpacity) styleCopy.fillOpacity = opacity;
        return styleCopy;
    }

    // --- MAP VIEW CONTROLLER. --------------------
    function setCountryView()
    {
        addCountryDefaultLayer();
        setFocus(StateType.NONE);
    }
    function setStateView(stateType)
    {
        if (!storeData.isReadyToDisplayCurrentMap()) return;

        addStateDistrictLayer(storeMap.plan, MapProperty.state.style);
        setFocus(stateType);
    }

    // --- MAP COLOR CONTROLLER ---------------------------
    function addCountryDefaultLayer()
    {
        StateTypeList.forEach((stateType) => {
            let option = {
                style: MapProperty.country.style,
                onEachFeature: (feature, layer) => { layer.on('click', () => OnStateClick(stateType)) }
            }
            let geoData = GeoData[stateType][GeoDataType.STATE];
            addGeoJsonLayer(geoData, stateType, option);
        })
        // addTileLayer(TileLayerType.PLACE_LABEL, true);
    }

    function addStateDistrictLayer(planType, style)
    {
        let option = {
            style: applyMixingValueToStyle(planType, style, false),
            onEachFeature: (feature, layer) => layer.on('click', () => onDistrictClick(feature, layer)),
        };

        let geojson = getProcessedGeoJson();
        if (!geojson) return;

        addGeoJsonLayer(geojson, LayerGroupType.STATE_DEFAULT, option);
    }

    function addTileLayer(layerType, isLayerGroup, option = {}){
        // only layerGroup is added into LayerGroupList.
        let target = (isLayerGroup)? L.layerGroup().addTo(map) : map;
        if (isLayerGroup) currLayerGroups[layerType] = target;
        L.tileLayer(MapProperty.urls[layerType], option).addTo(target);
    }

    function addGeoJsonLayer(geoData, layerGroupType, option = {})
    {
        // If target layerGroup is already in map, add new layer in the group. otherwise, create new.
        let layerGroup = (currLayerGroups[layerGroupType])? currLayerGroups[layerGroupType] : L.layerGroup().addTo(map);
        if (!currLayerGroups[layerGroupType]) {
            currLayerGroups[layerGroupType] = layerGroup;
        }
        L.geoJSON(geoData, option).addTo(layerGroup);
        return layerGroup;
    }

    // --- MAP ZOOM/PIVOT CONTROLLER. --------------------
    function setFocus(stateType)
    {
        if (viewState === stateType) return;
        let flyTo = (stateType === StateType.NONE)? MapProperty.country.flyTo : MapProperty.state[stateType]["flyTo"];
        map.flyTo(flyTo.pos, flyTo.zoom);
        setViewState(stateType)
    }
    return (
        <div ref={mapControllerRef}>
        </div>
    )
}
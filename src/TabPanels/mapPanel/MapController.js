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
    RefType, FilterType, PartyType, ColorMap, BoundSizeMap
} from '../../common/Enums';
import geoJsonHelper from '../../common/GeoJsonHelper';
import {convertBoundSizeToZoomLevel, convertFilterTypeToLayerType, convertFilterTypeToStyleType} from "../../common/ConversionHelper";
let currLayerGroups = {};

export default function MapController() {
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
    function main() {
        removeAllLayer();
        colorFilterSetup();
        highlightSetup();
        viewSetup();
    }

    function removeAllLayer() {
        const layerGroupProperties = Object.keys(currLayerGroups);
        layerGroupProperties.forEach((prop) => {
            let layerGroup = currLayerGroups[prop];
            delete currLayerGroups[prop];
            layerGroup.clearLayers();
        })
    }

    // --- SETUP FUNCTIONS ---------------------------
    function defaultSetup() {
        map.createPane(TileLayerType.PLACE_LABEL);
        map.getPane(TileLayerType.PLACE_LABEL).style.zIndex = 650; // topmost layer under popup.
        addTileLayer(TileLayerType.DEFAULT_WHITE);
        addTileLayer(TileLayerType.PLACE_LABEL, {pane: TileLayerType.PLACE_LABEL});
        map.setMaxBounds(MapProperty.country.default.maxBounds);
        map.setMaxZoom(MapProperty.country.default.maxZoom);
        map.setMinZoom(MapProperty.country.default.minZoom);
    }

    function viewSetup() {
        if (storeMap.isStateNone())
            setCountryView();
        else
            setStateView(storeMap.state);
    }

    function colorFilterSetup() {
        if (storeMap.isStateNone() || storeMap.colorFilter === FilterType.NONE || !storeData.isReadyToDisplayCurrentMap()) return;

        let geojson = getProcessedGeoJson();
        let stateModelData = storeData.getStateModelData(storeMap.plan, storeMap.state);
        let filterType = storeMap.colorFilter;
        let layerGroupType = convertFilterTypeToLayerType(filterType);
        let style = MapProperty.state[convertFilterTypeToStyleType(filterType)];
        if (!validCheck([geojson, stateModelData, filterType, layerGroupType])) return;
        const getStyleByDistrictInfo = (feature) => ({...style, color: GetColorByFilter(stateModelData, feature.properties.district_id, filterType)});
        addGeoJsonLayer(geojson, layerGroupType, {style: getStyleByDistrictInfo})
    }

    function GetColorByFilter(stateModel, districtId, filterType) {
        return (filterType === FilterType.PARTY)? getColorByParty(stateModel, districtId) : getColorByPopulation(stateModel, districtId, filterType);
    }

    function getColorByParty(stateModel, districtId) {
        let data = stateModel.summaryData;
        let party = stateModel.electionDataDict[districtId]?.winnerParty;
        let votes = stateModel.electionDataDict[districtId]?.winnerVotes;
        let min = (party === PartyType.DEMOCRATIC)? roundDownToFirstDecimal(data.minDemocrats) : roundDownToFirstDecimal(data.minRepublicans);
        let max = (party === PartyType.DEMOCRATIC)? roundUpToFirstDecimal(data.maxDemocrats) : roundUpToFirstDecimal(data.maxRepublicans);
        let variation = roundUpToFirstDecimal((max - min) / 5);

        if (!validCheck([data, party, votes])) return ColorMap.DEFAULT_WHITE;

        if (votes >= max)               return (party === PartyType.DEMOCRATIC)? ColorMap.DEMOCRATIC_LV6 : ColorMap.REPUBLICAN_LV6;
        if (votes >= min + 4*variation) return (party === PartyType.DEMOCRATIC)? ColorMap.DEMOCRATIC_LV5 : ColorMap.REPUBLICAN_LV5;
        if (votes >= min + 3*variation) return (party === PartyType.DEMOCRATIC)? ColorMap.DEMOCRATIC_LV4 : ColorMap.REPUBLICAN_LV4;
        if (votes >= min + 2*variation) return (party === PartyType.DEMOCRATIC)? ColorMap.DEMOCRATIC_LV3 : ColorMap.REPUBLICAN_LV3;
        if (votes >= min + 1*variation) return (party === PartyType.DEMOCRATIC)? ColorMap.DEMOCRATIC_LV2 : ColorMap.REPUBLICAN_LV2;
        if (votes >= 0)                 return (party === PartyType.DEMOCRATIC)? ColorMap.DEMOCRATIC_LV1 : ColorMap.REPUBLICAN_LV1;
    }

    function getColorByPopulation(stateModel, districtId, filterType) {
        let data = stateModel.summaryData;
        let votes = stateModel.electionDataDict[districtId].getVotesByFilter(filterType);
        let min = roundDownToFirstDecimal(data.getMinByFilter(filterType));
        let max = roundUpToFirstDecimal(data.getMaxByFilter(filterType));
        let variation = roundUpToFirstDecimal((max - min) / 5);

        if (!validCheck([data, votes, min, max, variation])) return ColorMap.DEFAULT_WHITE;

        if (votes >= max)               return ColorMap.POPULATION_LV6;
        if (votes >= min + 4*variation) return ColorMap.POPULATION_LV5;
        if (votes >= min + 3*variation) return ColorMap.POPULATION_LV4;
        if (votes >= min + 2*variation) return ColorMap.POPULATION_LV3;
        if (votes >= min + 1*variation) return ColorMap.POPULATION_LV2;
        if (votes >= 0)                 return ColorMap.POPULATION_LV1;
    }

    function highlightSetup() {
        if (
            !storeData.isReadyToDisplayCurrentMap() ||
            storeMap.isStateNone() ||
            storeMap.getHighlightDistrictId() === -1
        ) return;

        let geojson = storeData.getStateGeoJson(storeMap.getMapPlan(), storeMap.getState())
        let selectedDistrictJson = geoJsonHelper.getFilteredGeoJsonByIDs(geojson, [storeMap.getHighlightDistrictId()])
        let option = {style: MapProperty.state["highlight"]}
        let layerGroup = addGeoJsonLayer(selectedDistrictJson, LayerGroupType.HIGHLIGHT, option);
        let innerLayers = layerGroup.getLayers()[0]._layers
        let key = Object.keys(innerLayers)[0];

        if (storeMap.getHighlightDistrictId() !== highlightDistrictId) {
            setHighlightDistrictId(storeMap.getHighlightDistrictId());
            flyToLayer(innerLayers[key])
        }
    }

    function getProcessedGeoJson() {
        if (!storeData.isGeojsonReady(storeMap.plan, storeMap.state)) return null;

        let geojson = storeData.getStateGeoJson(storeMap.plan, storeMap.state);

        if (!storeMap.incumbentFilter) return geojson;

        let stateModelData = storeData.getStateModelData(storeMap.plan, storeMap.state);
        let ids = stateModelData.getIncumbentDistrictIDs();
        return geoJsonHelper.getFilteredGeoJsonByIDs(geojson, ids);
    }

    // --- EVENT HANDLER -------------------------
    function onStateClick(stateType) {
        storeMap.selectState(stateType);
        storeData.addStateData(storeMap.plan, stateType);
    }

    function onDistrictClick(feature, layer) {
        storeMap.highlightDistrict(feature.properties.district_id);
        flyToLayer(layer);
    }

    function flyToLayer(layer) {
        let boundSize = getBoundsSize(layer.getBounds());
        let layerCenter = layer.getBounds().getCenter();
        let zoomLevel = convertBoundSizeToZoomLevel(boundSize);

        if (map.getZoom() !== zoomLevel || !map.getBounds().contains(layerCenter))
            map.flyTo(layerCenter, zoomLevel);
    }

    function getBoundsSize(bounds) {
        if (!bounds) return BoundSizeMap.Level6;
        return bounds.getNorthEast().distanceTo(bounds.getNorthWest());
    }

    // --- MAP VIEW CONTROLLERS --------------------
    function setCountryView() {
        addCountryDefaultLayer();
        setFocus(StateType.NONE);
    }
    function setStateView(stateType) {
        if (!storeData.isReadyToDisplayCurrentMap()) return;

        addStateDistrictLayer(storeMap.plan, MapProperty.state.style);
        setFocus(stateType);
    }

    // --- MAP COLOR / DRAWING CONTROLLERS ---------------------------
    function addCountryDefaultLayer() {
        StateTypeList.forEach((stateType) => {
            let option = {
                style: MapProperty.country.style,
                onEachFeature: (feature, layer) => layer.on('click', () => onStateClick(stateType)),
            }
            let geoData = GeoData[stateType][GeoDataType.STATE];
            addGeoJsonLayer(geoData, stateType, option);
        })
    }

    function addStateDistrictLayer(planType, style) {
        let option = {
            style: style,
            onEachFeature: (feature, layer) => layer.on('click', () => onDistrictClick(feature, layer)),
        };

        let geojson = getProcessedGeoJson();
        if (!geojson) return;

        addGeoJsonLayer(geojson, LayerGroupType.STATE_DEFAULT, option);
    }

    function addTileLayer(layerType, option = {}){
        L.tileLayer(MapProperty.urls[layerType], option).addTo(map);
    }

    function addGeoJsonLayer(geoData, layerGroupType, option = {}) {
        // If target layerGroup is already in map, add new layer in the group. otherwise, create new.
        let layerGroup = (currLayerGroups[layerGroupType])? currLayerGroups[layerGroupType] : L.layerGroup().addTo(map);
        if (!currLayerGroups[layerGroupType]) {
            currLayerGroups[layerGroupType] = layerGroup;
        }
        L.geoJSON(geoData, option).addTo(layerGroup);
        return layerGroup;
    }

    function validCheck(list) {
        list.forEach((v) => {
            if (!v) return false;
        })
        return true;
    }

    function roundUpToFirstDecimal(number) {
        if (number <= 0) return 0;
        return Math.ceil(number / 10 ** (Math.floor(Math.log10(number)) - 1)) * 10 ** (Math.floor(Math.log10(number)) - 1)
    }

    function roundDownToFirstDecimal(number) {
        if (number <= 0) return 0;
        return Math.floor(number / 10 ** (Math.floor(Math.log10(number)) - 1)) * 10 ** (Math.floor(Math.log10(number)) - 1)
    }

    function setFocus(stateType) {
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
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import StoreContext from '../../common/Store';
import MapProperty from './MapProperty.json';
import {
    TileLayerType,
    LayerGroupType,
    GeoData,
    GeoDataType,
    availableStateTypes,
    StateType,
    MapFilterType,
    PartyType,
    colorDict,
    boundSizeDict,
    democraticColors,
    republicanColors,
    StyleType,
    populationColors,
    PopulationType
} from '../../common/GlobalVariables';
import geoJsonHelper from '../../common/GeoJsonHelper';
import {
    convertBoundSizeToZoomLevel,
    convertMapFilterTypeToLayerType,
    convertMapFilterTypeToPopulationType,
    convertMapFilterTypeToStyleType
} from "../../common/ConversionHelper";
import {
    calculateHeatMapFeatureValues,
    roundDownToFirstDecimal,
    roundUpToFirstDecimal
} from "../../common/CalculationHelper";

let currLayerGroups = {};

export default function MapController() {
    const { storeMap, storeData, callbacks } = useContext(StoreContext);
    const [ viewType, setViewType ] = useState(StateType.NONE);
    const [ highlightedDistrictId, setHighlightedDistrictId ] = useState(-1);
    const mapControllerRef = useRef(null);
    const map = useMap();
    const resetStateMap = useCallback(() => {
        setViewType(StateType.NONE);
    }, [])

    useEffect(() => {
        setupDefault();
        callbacks.addOnResetState(resetStateMap);
        return setViewType(StateType.NONE);
    }, [])

    main();
    function main() {
        removeAllLayer();
        setupMapFilter();
        setupHighlightDistrict();
        setupView();
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
    function setupDefault() {
        map.createPane(TileLayerType.PLACE_LABEL);
        map.getPane(TileLayerType.PLACE_LABEL).style.zIndex = 650; // topmost layer under popup.
        addTileLayer(TileLayerType.white);
        addTileLayer(TileLayerType.PLACE_LABEL, {pane: TileLayerType.PLACE_LABEL});
        map.setMaxBounds(MapProperty.country.default.maxBounds);
        map.setMaxZoom(MapProperty.country.default.maxZoom);
        map.setMinZoom(MapProperty.country.default.minZoom);
    }

    function setupView() {
        if (storeMap.isStateNone())
            setCountryView();
        else
            setStateView(storeMap.state);
    }

    function setupMapFilter() {
        if (storeMap.isStateNone() || storeMap.mapMapFilterType === MapFilterType.NONE || !storeData.isReadyToDisplayCurrentMap()) return;

        let geojson = getProcessedGeoJson();
        let stateModelData = storeData.getStateModelData(storeMap.plan, storeMap.state);
        let mapFilterType = storeMap.mapMapFilterType;
        let layerGroupType = convertMapFilterTypeToLayerType(mapFilterType);
        let style = MapProperty.state[convertMapFilterTypeToStyleType(mapFilterType)];
        if (!validCheck([geojson, stateModelData, mapFilterType, layerGroupType])) return;
        const getStyleByDistrictInfo = (feature) => ({...style, color: getColorByFilter(stateModelData, feature.properties.district_id, mapFilterType)});
        addNewLayerToLayerGroup(geojson, layerGroupType, {style: getStyleByDistrictInfo})
    }

    function getColorByFilter(stateModel, districtId, mapFilterType) {
        return (mapFilterType === MapFilterType.PARTY)? getColorByParty(stateModel, districtId) : getColorByPopulation(stateModel, districtId, mapFilterType);
    }

    function getColorByParty(stateModel, districtId) {
        let data = stateModel.summaryData;
        let party = stateModel.electionDataDict[districtId]?.winnerParty;
        let demVoteMargin = stateModel.electionDataDict[districtId]?.demVoteMargin;
        if (!validCheck([data, demVoteMargin])) return colorDict.white;

        let isDemocratic = party === PartyType.DEMOCRATIC;
        let maxVoteMargin = isDemocratic? data.maxDemVoteMargin : -data.maxDemVoteMargin;

        let featureValues = calculateHeatMapFeatureValues(0, maxVoteMargin);

        let partyColorArray = isDemocratic? democraticColors : republicanColors;

        for (let i = 0; i < featureValues.length; i++) {
            if (demVoteMargin < featureValues[i]) {
                return partyColorArray[i];
            }
        }
    }

    function getColorByPopulation(stateModel, districtId, mapFilterType) {
        let stateSummaryData = stateModel.summaryData;
        let populationType = convertMapFilterTypeToPopulationType(mapFilterType);
        if (populationType === PopulationType.NONE) return colorDict.white;
        let population = stateModel.electionDataDict[districtId].getPopulationByType(populationType);
        let min = stateSummaryData.getMinPopulationByType(populationType);
        let max = stateSummaryData.getMaxPopulationByType(populationType);

        if (!validCheck([stateSummaryData, population, min, max])) return colorDict.white;

        let featureValues = calculateHeatMapFeatureValues(min, max);
        for (let i = 0; i < featureValues.length; i++) {
            if (population < featureValues[i]) {
                return populationColors[i];
            }
        }
    }

    function setupHighlightDistrict() {
        if (
            !storeData.isReadyToDisplayCurrentMap() ||
            storeMap.isStateNone() ||
            storeMap.getHighlightDistrictId() === -1
        ) return;

        let geojson = storeData.getStateGeoJson(storeMap.getMapPlan(), storeMap.getState())
        let selectedDistrictJson = geoJsonHelper.getFilteredGeoJsonByIDs(geojson, [storeMap.getHighlightDistrictId()])
        let option = {style: MapProperty.state[StyleType.HIGHLIGHT]}
        let layerGroup = addNewLayerToLayerGroup(selectedDistrictJson, LayerGroupType.HIGHLIGHT, option);
        let innerLayers = layerGroup.getLayers()[0]._layers
        let key = Object.keys(innerLayers)[0];

        if (storeMap.getHighlightDistrictId() !== highlightedDistrictId) {
            setHighlightedDistrictId(storeMap.getHighlightDistrictId());
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
        let boundsSize = getBoundsSize(layer.getBounds());
        let layerCenter = layer.getBounds().getCenter();
        let zoomLevel = convertBoundSizeToZoomLevel(boundsSize);

        if (map.getZoom() !== zoomLevel || !map.getBounds().contains(layerCenter))
            map.flyTo(layerCenter, zoomLevel);
    }

    function getBoundsSize(bounds) {
        return (bounds)? bounds.getNorthEast().distanceTo(bounds.getNorthWest()) : boundSizeDict.level6;
    }

// --- MAP VIEW CONTROLLERS --------------------
    function setCountryView() {
        addCountryDefaultLayer();
        setMapFocus(StateType.NONE);
    }
    function setStateView(stateType) {
        if (!storeData.isReadyToDisplayCurrentMap()) return;

        addStateDistrictLayer(storeMap.plan, MapProperty.state.style);
        setMapFocus(stateType);
    }

// --- MAP COLOR / DRAWING CONTROLLERS ---------------------------
    function addCountryDefaultLayer() {
        availableStateTypes.forEach((stateType) => {
            let option = {
                style: MapProperty.country.style,
                onEachFeature: (feature, layer) => layer.on('click', () => onStateClick(stateType)),
            }
            let geoData = GeoData[stateType][GeoDataType.STATE];
            addNewLayerToLayerGroup(geoData, stateType, option);
        })
    }

    function addStateDistrictLayer(planType, style) {
        let option = {
            style: style,
            onEachFeature: (feature, layer) => layer.on('click', () => onDistrictClick(feature, layer)),
        };

        let geojson = getProcessedGeoJson();
        if (!geojson) return;

        addNewLayerToLayerGroup(geojson, LayerGroupType.STATE_DEFAULT, option);
    }

    function addTileLayer(layerType, option = {}){
        L.tileLayer(MapProperty.urls[layerType], option).addTo(map);
    }

    function addNewLayerToLayerGroup(geoData, layerGroupType, option = {}) {
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

    function setMapFocus(stateType) {
        if (viewType === stateType) return;
        let flyToInfo = (stateType === StateType.NONE)? MapProperty.country.flyTo : MapProperty.state[stateType]["flyTo"];
        map.flyTo(flyToInfo.pos, flyToInfo.zoom);
        setViewType(stateType)
    }

    return ( <div ref={mapControllerRef}/> )
}
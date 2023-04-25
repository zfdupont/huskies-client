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
} from '../../common/GlobalVariables';
import geoJsonHelper from '../../common/GeoJsonHelper';
import {
    convertBoundSizeToZoomLevel,
    convertMapFilterTypeToLayerType,
    convertMapFilterTypeToPopulationType,
    convertMapFilterTypeToStyleType
} from "../../common/ConversionHelper";

let currLayerGroups = {};

export default function MapController() {
    const { mapStore, dataStore, callbacks } = useContext(StoreContext);
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

    removeAllLayer();
    setupMapFilter();
    setupHighlightDistrict();
    setupView();

    function removeAllLayer() {
        const layerGroupProperties = Object.keys(currLayerGroups);
        layerGroupProperties.forEach((prop) => {
            let layerGroup = currLayerGroups[prop];
            delete currLayerGroups[prop];
            layerGroup.clearLayers();
        })
    }

    function setupDefault() {
        map.createPane(TileLayerType.PLACE_LABEL);
        map.getPane(TileLayerType.PLACE_LABEL).style.zIndex = 650; // topmost layer under popup.
        addTileLayer(TileLayerType.white);
        addTileLayer(TileLayerType.PLACE_LABEL, {pane: TileLayerType.PLACE_LABEL});
        map.setMaxBounds(MapProperty.country.default.maxBounds);
        map.setMaxZoom(MapProperty.country.default.maxZoom);
        map.setMinZoom(MapProperty.country.default.minZoom);
    }

    function setupMapFilter() {
        if (mapStore.isStateNone() || !dataStore.isReadyToDisplayCurrentMap()) return;

        if (mapStore.incumbentFilter) {
            setMapIncumbentFilter();
        }
        if (mapStore.mapFilterType !== MapFilterType.NONE ) {
            setMapColorFilter();
        }
    }
    function setMapIncumbentFilter() {
        let layerGroupType = LayerGroupType.INCUMBENT;
        let notIncumbentGeojson =  getNotIncumbentGeojson();
        addNewLayerToLayerGroup(notIncumbentGeojson, layerGroupType, {style: MapProperty.state.incumbentStyle});
    }

    function getNotIncumbentGeojson() {
        let stateData = dataStore.getStateModelData(mapStore.plan, mapStore.state);
        let geojson = dataStore.getStateGeoJson(mapStore.plan, mapStore.state);
        geojson = geoJsonHelper.getFilteredGeoJsonByIDs(geojson, stateData.getNotIncumbentDistrictIDs());
        return geojson;
    }

    function setMapColorFilter() {
        let geojson = getFilteredGeojson();
        let stateData = dataStore.getStateModelData(mapStore.plan, mapStore.state);
        let mapFilterType = mapStore.mapFilterType;
        let layerGroupType = convertMapFilterTypeToLayerType(mapFilterType);
        let style = MapProperty.state[convertMapFilterTypeToStyleType(mapFilterType)];
        if (!validCheck([geojson, stateData, mapFilterType, layerGroupType])) return;
        const getStyleByDistrictInfo = (feature) => ({...style, color: getColorByFilter(stateData, feature.properties.district_id, mapFilterType)});
        addNewLayerToLayerGroup(geojson, layerGroupType, {style: getStyleByDistrictInfo})
    }

    function getColorByFilter(stateModel, districtId, mapFilterType) {
        if (mapFilterType === MapFilterType.VICTORYMARGIN){
            let electionData = stateModel.electionDataDict[districtId];
            let party = electionData.winnerParty;
            let victoryMarginPercent = electionData.winVotePercent - electionData.loseVotePercent;
            let featureValues = stateModel.heatMapData.victoryMarginFeatureValues;
            return getColorByVictoryMargin(featureValues, victoryMarginPercent, party);
        }
        else {
            let populationType = convertMapFilterTypeToPopulationType(mapFilterType);
            let population = stateModel.electionDataDict[districtId].getPopulationByType(populationType);
            let featureValues = stateModel.heatMapData.getFeatureValuesByPopulationType(populationType);
            return getColorByPopulation(featureValues, population);
        }
    }

    function getColorByVictoryMargin(featureValues, victoryMarginPercent, partyType) {
        let partyColorArray = partyType === PartyType.DEMOCRATIC? democraticColors : republicanColors;

        for (let i = 0; i < featureValues.length; i++) {
            if (victoryMarginPercent < featureValues[i]) {
                return partyColorArray[i];
            }
        }
    }

    function getColorByPopulation(featureValues, population) {
        if (featureValues == null || featureValues.length < populationColors.length) return colorDict.white;

        for (let i = 0; i < featureValues.length; i++) {
            if (population < featureValues[i]) {
                return populationColors[i];
            }
        }
    }

    function setupHighlightDistrict() {
        if (
            !dataStore.isReadyToDisplayCurrentMap() ||
            mapStore.isStateNone() ||
            mapStore.getHighlightDistrictId() === null
        ) return;

        // Highlight selected district.
        let geojson = dataStore.getStateGeoJson(mapStore.getMapPlan(), mapStore.getState())
        let selectedDistrictJson = geoJsonHelper.getFilteredGeoJsonById(geojson, mapStore.getHighlightDistrictId())
        let option = {style: MapProperty.state[StyleType.HIGHLIGHT]}
        let layerGroup = addNewLayerToLayerGroup(selectedDistrictJson, LayerGroupType.HIGHLIGHT, option);
        // Fly to selected district.
        let innerLayers = layerGroup.getLayers()[0]._layers
        let key = Object.keys(innerLayers)[0];
        if (mapStore.getHighlightDistrictId() !== highlightedDistrictId) {
            setHighlightedDistrictId(mapStore.getHighlightDistrictId());
            flyToLayer(innerLayers[key])
        }
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

    function setupView() {
        if (mapStore.isStateNone())
            setCountryView();
        else
            setStateView(mapStore.state);
    }

    function setCountryView() {
        addCountryDefaultLayer();
        setMapFocus(StateType.NONE);
    }
    function setStateView(stateType) {
        if (!dataStore.isReadyToDisplayCurrentMap()) return;

        addStateDistrictLayer(mapStore.plan, MapProperty.state.style);
        setMapFocus(stateType);
    }
    function addStateDistrictLayer(planType, style) {
        let option = {
            style: style,
            onEachFeature: (feature, layer) => layer.on('click', () => onDistrictClick(feature, layer)),
        };

        let geojson = getFilteredGeojson();
        addNewLayerToLayerGroup(geojson, LayerGroupType.STATE_DEFAULT, option);
    }

    function setMapFocus(stateType) {
        if (viewType === stateType) return;
        let flyToInfo = (stateType === StateType.NONE)? MapProperty.country.flyTo : MapProperty.state[stateType]["flyTo"];
        map.flyTo(flyToInfo.pos, flyToInfo.zoom);
        setViewType(stateType)
    }

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

    function onStateClick(stateType) {
        mapStore.selectState(stateType);
    }

    function onDistrictClick(feature, layer) {
        mapStore.highlightDistrict(feature.properties.district_id);
        flyToLayer(layer);
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

    function getFilteredGeojson() {
        let stateData = dataStore.getStateModelData(mapStore.plan, mapStore.state);
        let geojson = dataStore.getStateGeoJson(mapStore.plan, mapStore.state);
        if (mapStore.incumbentFilter) {
            geojson = geoJsonHelper.getFilteredGeoJsonByIDs(geojson, stateData.getIncumbentDistrictIDs());
        }
        return geojson;
    }

    function validCheck(list) {
        list.forEach((v) => {
            if (!v) return false;
        })
        return true;
    }

    return ( <div ref={mapControllerRef}/> )
}
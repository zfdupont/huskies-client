import {createContext, useState} from 'react';
import {
    StateType,
    TabType,
    PlanType,
    MapFilterType,
    MapActionType,
    PageActionType,
    DataActionType
} from './GlobalVariables';
import api from './api.js';
import StateModel from "../models/StateModel";
export const StoreContext = createContext({});

// --- CONTEXT PROVIDER---------------------------------
function StoreContextProvider(props) {
    const [mapStore, setMapStore] = useState({
        plan: null,
        subPlan: null,
        state: StateType.NONE,
        prevState: null,
        districtId: null,
        mapFilterType: MapFilterType.NONE,
        incumbentFilter: false,
        heatMapFeatureValues: [],
    })
    const [dataStore, setDataStore] = useState({
        planType: PlanType,
        stateData: {},
        geojson: {},
        districtBoundData: {},
        ensemble: {}
    })
    const [pageStore, setPageStore] = useState({
        tabType: TabType.MAP
    })

    const [callbacks, setCallbacks] = useState({
        resetState: [],
    })


// --- STORE REDUCERS---------------------------------------
    const mapStoreReducer = (action) => {
        const {type, payload} = action;
        switch (type) {
            case MapActionType.SELECT_PLAN:
                return setMapStore((prev) => ({...prev, plan: payload.planType}));
            case MapActionType.SELECT_SUB_PLAN:
                return setMapStore((prev) => ({...prev, subPlan: payload.subPlanType}));
            case MapActionType.SELECT_STATE:
                return setMapStore((prev) => ({...prev, state: payload.stateType, districtId: null}));
            case MapActionType.UNSELECT_STATE:
                return setMapStore((prev) => ({...prev, state: StateType.NONE}));
            case MapActionType.UPDATE_COLOR_FILTER:
                return setMapStore((prev) => ({...prev, mapFilterType: payload.mapFilterType}));
            case MapActionType.UPDATE_INCUMBENT_FILTER:
                return setMapStore((prev) => ({...prev, incumbentFilter: payload.isIncumbent}));
            case MapActionType.HIGHLIGHT_DISTRICT:
                return setMapStore((prev) => ({...prev, districtId: payload.districtId}));
            case MapActionType.SET_HEATMAP_FEATURE_VALUES:
                return setMapStore((prev) => ({...prev, heatMapFeatureValues: []}))
            case MapActionType.RESET_STATE:
                return setMapStore((prev) => ({...prev, districtId: null}))
            case MapActionType.RESET_PAGE:
                return setMapStore((prev) => ({...prev}));
            default:
                return;
        }
    }
    const dataStoreReducer = (action) => {
        const {type, payload} = action;
        switch (type) {
            case DataActionType.ADD_STATE_DATA:
                dataStore.stateData[payload.planType] = dataStore.stateData[payload.planType] ?? {};
                dataStore.geojson[payload.planType] = dataStore.geojson[payload.planType] ?? {};

                dataStore.stateData[payload.planType][payload.stateType] = payload.stateModelData;
                dataStore.geojson[payload.planType][payload.stateType] = payload.geojson;

                dataStore.ensemble = payload.ensemble;
                return setDataStore({
                    stateData: dataStore.stateData,
                    geojson: dataStore.geojson,
                    ensemble: dataStore.ensemble
                })
            default:
                return;
        }
    }
    const pageStoreReducer = (action) => {
        const {type, payload} = action;
        switch (type) {
            case PageActionType.UPDATE_TAB:
                return setPageStore((prev) => ({...prev, tabType: payload.tabType}))
            default:
                return;
        }
    }

// --- MAP STORE FUNCTIONS -----------------------------
    mapStore.selectPlan = function(planType) {
        if (planType === mapStore.plan) return;

        mapStoreReducer({
            type: MapActionType.SELECT_PLAN,
            payload: { planType: planType }
        })
    }

    mapStore.selectSubPlan = async function(planType)
    {
        if (mapStore.subPlan === planType || mapStore.plan === planType) return;

        mapStoreReducer({
            type: MapActionType.SELECT_SUB_PLAN,
            payload: {subPlanType: planType},
        })
        await dataStore.addStateData(planType, mapStore.state);
    }

    mapStore.selectState = async function(stateType) {
        mapStoreReducer({
            type: MapActionType.SELECT_STATE,
            payload: {
                stateType: stateType,
            }
        })
        await dataStore.addStateData(mapStore.plan, stateType);
    }

    mapStore.unselectState = function() {
        mapStoreReducer({
            type: MapActionType.UNSELECT_STATE,
            payload: null,
        })
    }

    mapStore.setColorFilter = function(mapFilterType) {
        mapStoreReducer({
            type: MapActionType.UPDATE_COLOR_FILTER,
            payload: {mapFilterType: mapFilterType}
        })
    }

    mapStore.setIncumbentFilter = function(isIncumbent) {
        mapStoreReducer({
            type: MapActionType.UPDATE_INCUMBENT_FILTER,
            payload: {isIncumbent: isIncumbent},
        })
    }

    mapStore.highlightDistrict = function(districtId) {
        if (mapStore.districtId === districtId) {
            districtId = null;
        }
        mapStoreReducer({
            type: MapActionType.HIGHLIGHT_DISTRICT,
            payload: {districtId: districtId}
        })
    }

    mapStore.mixingValueChange = function(value) {
        mapStoreReducer({
            type: MapActionType.MIXING_VALUE_CHANGE,
            payload: {value: value},
        })
    }

    mapStore.resetPage = function() {
        mapStoreReducer({
            type: MapActionType.RESET_PAGE,
            payload: null,
        })
    }

    mapStore.resetState = function() {
        mapStoreReducer({
            type: MapActionType.RESET_STATE,
            payload: null,
        })
        callbacks.invokeAll(callbacks.resetState);
    }
    
    mapStore.setHeatMapFeatureValues = function(heatMapFeatureValues) {
        mapStoreReducer({
            type: MapActionType.SET_HEATMAP_FEATURE_VALUES,
            payload: { heatMapFeatureValues: heatMapFeatureValues }
        })
    }


// --- DATA STORE FUNCTIONS -----------------------------
    
    dataStore.setDistrictIdOfGeojson = function(geojson) {
        geojson.features.forEach((district, index) => {
            district.properties.district_id = (index + 1).toString();
        })
    }

    dataStore.createStateDataByGeojson = function(planType, stateType, geojson) {
        let geojsonStateProperties = {};
        geojson.features.forEach((district, index) => {
            geojsonStateProperties[district.properties.district_id] = district.properties;
        })

        dataStore.addMockData(geojsonStateProperties); // TO DO: remove this line if all data ready.

        return new StateModel(planType, stateType, geojsonStateProperties);
    }

    dataStore.addMockData = function(stateData) {
        for (let key in stateData)
        {
            stateData[key]["DemocraticCandidate"] = "NameName NameName1" + key;
            stateData[key]["RepublicanCandidate"] = "NameName NameName2" + key;
            stateData[key]["Incumbent"] = (parseInt(key) % 2 === 0)? "NameName NameName1" + key : "None";
            stateData[key]["IncumbentParty"] = "Democratic";
            stateData[key]["VAPTOTAL_common"] = 12345;
            stateData[key]["VAPTOTAL_added"] = 2341;
            stateData[key]["VAPTOTAL_lost"] = 1243;
            stateData[key]["ALAND20_common"] = 123456;
            stateData[key]["ALAND20_added"] = 2345;
            stateData[key]["ALAND20_lost"] = 1234;
            stateData[key]["VAPBLACK_common"] = 12345;
            stateData[key]["VAPBLACK_added"] = 2345;
            stateData[key]["VAPBLACK_lost"] = 1234;
            stateData[key]["VAPWHITE_common"] = 34567;
            stateData[key]["VAPWHITE_added"] = 1234;
            stateData[key]["VAPWHITE_lost"] = 5432;
            stateData[key]["VAPASIAN_common"] = 76543;
            stateData[key]["VAPASIAN_added"] = 1234;
            stateData[key]["VAPASIAN_lost"] = 2453;
            stateData[key]["VAPREPUBLICAN_common"] = 76543;
            stateData[key]["VAPREPUBLICAN_added"] = 1234;
            stateData[key]["VAPREPUBLICAN_lost"] = 2345;
            stateData[key]["VAPDEMOCRATS_common"] = 1234567;
            stateData[key]["VAPDEMOCRATS_added"] = 23451;
            stateData[key]["VAPDEMOCRATS_lost"] = 12345;
        }
    }

    dataStore.createBarchartDataByEnsemble = function(ensemble) {
        //because ensemble is currently not populated by server, all data will be mocked
        // TO DO: remove below code after api call is implemented
        let data = []
        for (let x = 17; x < 24; x++) {
            data.push({name: x, plan: Math.floor(Math.random() * 700) + 100});
        }
        return data;
    }

    dataStore.addStateData = async (planType, stateType) => {
        if (dataStore.isStateDataReady(planType, stateType)) return;

        let geojson = await api.getStateGeojson(planType, stateType);
        let summaryJson =  await api.getStateSummaryJson(stateType);

        dataStore.setDistrictIdOfGeojson(geojson); // TO DO : remove this line if DistrictId error removed.

        let stateModelData = dataStore.createStateDataByGeojson(planType, stateType, geojson);
        let barchartData = dataStore.createBarchartDataByEnsemble();
        dataStoreReducer({
            type: DataActionType.ADD_STATE_DATA,
            payload: {planType: planType, stateType: stateType, geojson: geojson, stateModelData: stateModelData, ensemble: {barchartData}}
        })
    }

// --- PAGE STORE FUNCTIONS -----------------------------
    pageStore.selectTab = function(tabType) {
        pageStoreReducer({
            type: PageActionType.UPDATE_TAB,
            payload: { tabType: tabType }
        })
    }

// --- CALLBACK FUNCTIONS -----------------------------
    callbacks.addOnResetState = function(callback) {
        setCallbacks((prev) => ({...prev, resetState: [...prev.resetState, callback]}))
    }

    callbacks.invokeAll = function(callbacks) {
        callbacks.forEach((func) => func());
    }
// --- HELPER FUNCTIONS -----------------------------
    mapStore.getMapPlan = () => mapStore.plan;
    mapStore.getSubPlan = () => mapStore.subPlan;
    mapStore.getState = () => mapStore.state;
    mapStore.getHighlightDistrictId = () => mapStore.districtId;
    mapStore.isPlanSelected = () => mapStore.plan !== null;
    mapStore.isSubPlanSelected = () => mapStore.subPlan !== null;
    mapStore.isStateChanged = () => mapStore.state !== mapStore.prevState;
    mapStore.isStateNone = () => mapStore.state === StateType.NONE;
    mapStore.isStateMatch = (stateType) => stateType === mapStore.state;

    dataStore.getPlanType = () => dataStore.planType;
    dataStore.getStateGeoJson = (planType, stateType) => JSON.parse(JSON.stringify(dataStore.geojson[planType][stateType]));
    dataStore.getStateModelData = (planType, stateType) => dataStore.stateData[planType][stateType];
    dataStore.getCurrentStateGeojson = (planType) => dataStore.geojson[planType][mapStore.state];
    dataStore.getEnsembleData = () => dataStore.ensemble;
    dataStore.isReadyToDisplayCurrentMap = () => dataStore.isStateDataReady(mapStore.plan, mapStore.state);
    // TO DO: once ensemble api call is usable, add to following functions -->
    dataStore.isStateDataReady = (planType, stateType) => {
        return dataStore.isModelDataReady(planType, stateType) && dataStore.isGeojsonReady(planType, stateType);
    }
    dataStore.isModelDataReady = (planType, stateType) => {
        if (!dataStore.stateData[planType]) return false;
        if (!dataStore.stateData[planType][stateType]) return false;
        return true;
    }
    dataStore.isGeojsonReady = (planType, stateType) => {
        if (!dataStore.geojson[planType]) return false;
        if (!dataStore.geojson[planType][stateType]) return false;
        return true;
    }
    // STORE PAGE
    pageStore.isTabMatch = (tabType) => tabType === pageStore.tabType;

    return (
        <StoreContext.Provider value={{mapStore, dataStore, pageStore, callbacks}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
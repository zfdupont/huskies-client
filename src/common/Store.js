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

                return setDataStore({
                    stateData: dataStore.stateData,
                    geojson: dataStore.geojson,
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
            stateData[key].area_added = (!stateData[key].area_added)? 12345 : stateData[key].area_added;
            stateData[key].area_common = (!stateData[key].area_common)? 12345 : stateData[key].area_common;
            stateData[key].area_lost = (!stateData[key].area_added)? 12345 : stateData[key].area_added;
            stateData[key].area_variation = (!stateData[key].area_variation)? 0.123 : stateData[key].area_variation;
            stateData[key].democrat = (!stateData[key].democrat)? 12345 : stateData[key].democrat;
            stateData[key].democrat_added = (!stateData[key].democrat_added)? 12345 : stateData[key].democrat_added;
            stateData[key].democrat_candidate = (!stateData[key].democrat_candidate)? "dem Candidate" + key : stateData[key].democrat_candidate;
            stateData[key].democrat_common = (!stateData[key].democrat_common)? 12345 : stateData[key].democrat_common;
            stateData[key].democrat_lost = (!stateData[key].democrat_lost)? 12345 : stateData[key].democrat_lost;
            stateData[key].democrat_variation = (!stateData[key].democrat_variation)? 0.123 : stateData[key].democrat_variation;
            stateData[key].democrat_votes = (!stateData[key].democrat_votes)? 12345 : stateData[key].democrat_votes;
            stateData[key].district_id = (!stateData[key].district_id)? key : stateData[key].district_id;
            stateData[key].incumbent = (parseInt(key) % 2 === 0 )? stateData[key].democrat_candidate : null
            stateData[key].pop_total = (!stateData[key].pop_total)? 12345 : stateData[key].pop_total;
            stateData[key].republican = (!stateData[key].republican)? 12345 : stateData[key].republican;
            stateData[key].republican_added = (!stateData[key].republican_added)? 12345 : stateData[key].republican_added;
            stateData[key].republican_candidate = (!stateData[key].republican_candidate)? "rep Candidate" + key: stateData[key].republican_candidate;
            stateData[key].republican_common = (!stateData[key].republican_common)? 12345 : stateData[key].republican_common;
            stateData[key].republican_lost = (!stateData[key].republican_lost)? 12345 : stateData[key].republican_lost;
            stateData[key].republican_variation = (!stateData[key].republican_variation)? 0.123 : stateData[key].republican_variation;
            stateData[key].republican_votes = (!stateData[key].republican_votes)? 54321 : stateData[key].republican_votes;
            stateData[key].area_variation = (!stateData[key].area_variation)? 0.232 : stateData[key].area_variation;
            stateData[key].vap_asian = (!stateData[key].vap_asian)? 12345 : stateData[key].vap_asian;
            stateData[key].vap_asian_added = (!stateData[key].vap_asian)? 12345 : stateData[key].vap_asian;
            stateData[key].vap_asian_lost = (!stateData[key].vap_asian_lost)? 12345 : stateData[key].vap_asian_lost;
            stateData[key].vap_asian_variation = (!stateData[key].vap_asian_variation)? 0.123 : stateData[key].vap_asian_variation;
            stateData[key].vap_black_common = (!stateData[key].vap_black_common)? 12345 : stateData[key].vap_black_common;
            stateData[key].vap_black_lost = (!stateData[key].vap_black_lost)? 12345 : stateData[key].vap_black_lost;
            stateData[key].vap_black_variation = (!stateData[key].vap_black_variation)? 0.123 : stateData[key].vap_black_variation;
            stateData[key].vap_total = (!stateData[key].vap_total)? 12345 : stateData[key].vap_total;
            stateData[key].vap_total_added = (!stateData[key].vap_total_added)? 12345 : stateData[key].vap_total_added;
            stateData[key].vap_total_common = (!stateData[key].vap_total_common)? 12345 : stateData[key].vap_total_common;
            stateData[key].vap_total_lost = (!stateData[key].vap_total_lost)? 12345 : stateData[key].vap_total_lost;
            stateData[key].vap_total_variation = (!stateData[key].vap_total_variation)? 0.123 : stateData[key].vap_total_variation;
            stateData[key].vap_white = (!stateData[key].vap_white)? 12345 : stateData[key].vap_white;
            stateData[key].vap_white_added = (!stateData[key].vap_white_added)? 12345 : stateData[key].vap_white_added;
            stateData[key].vap_white_common = (!stateData[key].vap_white_common)? 12345 : stateData[key].vap_white_common;
            stateData[key].vap_white_lost = (!stateData[key].vap_white_lost)? 12345 : stateData[key].vap_white_lost;
            stateData[key].vap_white_variation = (!stateData[key].vap_white_variation)? 0.123 : stateData[key].vap_white_variation;
            stateData[key].winner = (!stateData[key].winner)? 'D' : stateData[key].winner;
        }
    }

    dataStore.addStateData = async (planType, stateType) => {
        if (dataStore.isStateDataReady(planType, stateType)) return;

        let geojson = await api.getStateGeojson(planType, stateType);
        console.log(geojson);
        let summaryJson =  await api.getStateSummaryJson(stateType);

        dataStore.setDistrictIdOfGeojson(geojson); // TO DO : remove this line if DistrictId error removed.

        let stateModelData = dataStore.createStateDataByGeojson(planType, stateType, geojson);

        dataStoreReducer({
            type: DataActionType.ADD_STATE_DATA,
            payload: {planType: planType, stateType: stateType, geojson: geojson, stateModelData: stateModelData}
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
    dataStore.isReadyToDisplayCurrentMap = () => dataStore.isStateDataReady(mapStore.plan, mapStore.state);
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
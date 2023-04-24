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
        districtId: null,
        prevState: null,
        mapFilterType: MapFilterType.NONE,
        incumbentFilter: false,
        resetState: 0,
        resetPage: 0,
    })
    const [dataStore, setDataStore] = useState({
        planType: PlanType,
        modelData: {},
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
            case MapActionType.PLAN_SELECT:
                return setMapStore((prev) => ({...prev, plan: payload.planType}));
            case MapActionType.SUB_PLAN_SELECT:
                return setMapStore((prev) => ({...prev, subPlan: payload.subPlanType}));
            case MapActionType.STATE_SELECT:
                return setMapStore((prev) => ({...prev, state: payload.stateType, districtId: null}));
            case MapActionType.STATE_UNSELECT:
                return setMapStore((prev) => ({...prev, state: StateType.NONE}));
            case MapActionType.UPDATE_COLOR_FILTER:
                return setMapStore((prev) => ({...prev, mapFilterType: payload.mapFilterType}));
            case MapActionType.UPDATE_INCUMBENT_FILTER:
                return setMapStore((prev) => ({...prev, incumbentFilter: payload.isIncumbent}));
            case MapActionType.DISTRICT_HIGHLIGHT:
                return setMapStore((prev) => ({...prev, districtId: payload.districtId}));
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
                dataStore.modelData[payload.planType] = dataStore.modelData[payload.planType] ?? {};
                dataStore.geojson[payload.planType] = dataStore.geojson[payload.planType] ?? {};

                dataStore.modelData[payload.planType][payload.stateType] = payload.stateModelData;
                dataStore.geojson[payload.planType][payload.stateType] = payload.geojson;

                return setDataStore({
                    modelData: dataStore.modelData,
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
            type: MapActionType.PLAN_SELECT,
            payload: { planType: planType }
        })
    }

    mapStore.selectSubPlan = async function(planType)
    {
        if (mapStore.subPlan === planType || mapStore.plan === planType) return;

        mapStoreReducer({
            type: MapActionType.SUB_PLAN_SELECT,
            payload: {subPlanType: planType},
        })
        await dataStore.addStateData(planType, mapStore.state);
    }

    mapStore.selectState = async function(stateType) {
        mapStoreReducer({
            type: MapActionType.STATE_SELECT,
            payload: {
                stateType: stateType,
            }
        })
        await dataStore.addStateData(mapStore.plan, stateType);
    }

    mapStore.unselectState = function() {
        mapStoreReducer({
            type: MapActionType.STATE_UNSELECT,
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
            type: MapActionType.DISTRICT_HIGHLIGHT,
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

// --- DATA STORE FUNCTIONS -----------------------------
//     dataStore.addPlanType = function(planKey, planValue) {
//         if (planKey in dataStore.planType) return;
//
//         dataStoreReducer({
//             type: DataActionType.ADD_PLAN_TYPE,
//             payload: {planKey: planKey, planValue: planValue},
//         })
//     }

    dataStore.setDistrictIdOfGeojson = function(geojson) {
        geojson.features.forEach((district, index) => {
            district.properties.district_id = (index + 1).toString();
        })
    }

    dataStore.createStateModelDataByGeojson = function(planType, stateType, geojson) {
        let stateProperties = {};
        geojson.features.forEach((district, index) => {
            stateProperties[(index + 1).toString()] = district.properties;
        })

        dataStore.addMockData(stateProperties); // TO DO: remove this line if all data ready.

        return new StateModel(planType, stateType, stateProperties);
    }

    dataStore.addMockData = function(modelData) {
        for (let key in modelData)
        {
            modelData[key]["DemocraticCandidate"] = "NameName NameName1" + key;
            modelData[key]["RepublicanCandidate"] = "NameName NameName2" + key;
            modelData[key]["Incumbent"] = (parseInt(key) % 2 === 0)? "NameName NameName1" + key : "None";
            modelData[key]["IncumbentParty"] = "Democratic";
            modelData[key]["VAPTOTAL_common"] = 12345;
            modelData[key]["VAPTOTAL_added"] = 2341;
            modelData[key]["VAPTOTAL_lost"] = 1243;
            modelData[key]["ALAND20_common"] = 123456;
            modelData[key]["ALAND20_added"] = 2345;
            modelData[key]["ALAND20_lost"] = 1234;
            modelData[key]["VAPBLACK_common"] = 12345;
            modelData[key]["VAPBLACK_added"] = 2345;
            modelData[key]["VAPBLACK_lost"] = 1234;
            modelData[key]["VAPWHITE_common"] = 34567;
            modelData[key]["VAPWHITE_added"] = 1234;
            modelData[key]["VAPWHITE_lost"] = 5432;
            modelData[key]["VAPASIAN_common"] = 76543;
            modelData[key]["VAPASIAN_added"] = 1234;
            modelData[key]["VAPASIAN_lost"] = 2453;
            modelData[key]["VAPREPUBLICAN_common"] = 76543;
            modelData[key]["VAPREPUBLICAN_added"] = 1234;
            modelData[key]["VAPREPUBLICAN_lost"] = 2345;
            modelData[key]["VAPDEMOCRATS_common"] = 1234567;
            modelData[key]["VAPDEMOCRATS_added"] = 23451;
            modelData[key]["VAPDEMOCRATS_lost"] = 12345;
        }
    }

    dataStore.addStateData = async (planType, stateType) => {
        if (dataStore.isStateDataReady(planType, stateType)) return;

        let geojson = await api.getStateGeojson(planType, stateType);
        console.log(geojson);
        let summaryJson =  await api.getStateSummaryJson(stateType);
        console.log(summaryJson);
        dataStore.setDistrictIdOfGeojson(geojson); // TO DO : remove this line if DistrictId error removed.

        let stateModelData = dataStore.createStateModelDataByGeojson(planType, stateType, geojson);

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
    dataStore.getStateModelData = (planType, stateType) => dataStore.modelData[planType][stateType];
    dataStore.getCurrentStateGeojson = (planType) => dataStore.geojson[planType][mapStore.state];
    dataStore.isReadyToDisplayCurrentMap = () => dataStore.isStateDataReady(mapStore.plan, mapStore.state);
    dataStore.isStateDataReady = (planType, stateType) => {
        return dataStore.isModelDataReady(planType, stateType) && dataStore.isGeojsonReady(planType, stateType);
    }
    dataStore.isModelDataReady = (planType, stateType) => {
        if (!dataStore.modelData[planType]) return false;
        if (!dataStore.modelData[planType][stateType]) return false;
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
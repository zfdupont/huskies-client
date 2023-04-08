import {createContext, useState} from 'react';
import {StateType, TabType, PlanType, GeoData, GeoDataType} from './Enums';
import MockData from './MockData';
import api, {getStateGeoJson} from './api.js';
import {createStateModel} from "./ConversionHelper";
export const StoreContext = createContext({});

export const MapActionType = {
    PLAN_SELECT: "plan_select",
    PLAN_UNSELECT: "plan_unselect",
    SUB_PLAN_SELECT: "sub_plan_select",
    STATE_SELECT: "state_select",
    STATE_UNSELECT: "state_unselect",
    UPDATE_FILTER: "update_filter",
    DISTRICT_HIGHLIGHT: "district_hover",
    MIXING_VALUE_CHANGE: "mixing_value_change",
}

export const DataActionType = {
    ADD_PLAN_TYPE: "add_plan_type",
    ADD_STATE_DATA: "add_state_data",
    SET_DISTRICT_BOUND_DATA: "add_district_bound_data",
}

export const PageActionType = {
    UPDATE_TAB: "change_tab",
}


// --- CONTEXT PROVIDER---------------------------------
function StoreContextProvider(props) {
    const [storeMap, setStoreMap] = useState({
        plan: null,
        subPlan: null,
        state: StateType.NONE,
        districtId: -1,
        prevState: null,
        filters: [],
        mixingValue: -1,
    })
    const [storeData, setStoreData] = useState({
        planType: PlanType,
        modelData: {},
        geojson: {},
        districtBoundData: {},
    })
    const [storePage, setStorePage] = useState({
        tab: TabType.MAP
    })
// --- STATE HELPER ---------------------------------
    function createMapState(plan, subPlan, stateType, filters, districtId, mixingValue)
    {
        if (plan === storeMap.subPlan)
        {
            subPlan = null;
        }
        return {
            plan: (plan !== undefined)? plan : storeMap.plan,
            subPlan: (subPlan !== undefined)? subPlan : storeMap.subPlan,
            state: (stateType !== undefined)? stateType : storeMap.state,
            prevState: storeMap.state,
            filters: (filters !== undefined)? filters : storeMap.filters,
            districtId: (districtId !== undefined)? districtId : storeMap.districtId,
            mixingValue: (mixingValue !== undefined)? mixingValue : storeMap.mixingValue,
        }
    }
    function createDataState(planType, stateType, modelData, geojson, districtBoundData, planKey, planValue)
    {
        let newData = storeData;
        newData.modelData[planType] = newData.modelData[planType] ?? {}; // set {} if null.
        newData.geojson[planType] = newData.geojson[planType] ?? {};

        newData.modelData[planType][stateType] = modelData;
        newData.geojson[planType][stateType] = geojson;

        if (planKey && planValue)
        {
            newData.planType[planKey] = planValue;
        }

        return {
            planType: newData.planType,
            modelData: newData.modelData,
            geojson: newData.geojson,
            districtBoundData: (districtBoundData !== undefined)? districtBoundData : storeData.districtBoundData,
        };
    }

    function createPageState(tabType)
    {
        return {
            tab: (tabType !== undefined)? tabType : storePage.tab
        }
    }


// --- REDUCER ---------------------------------------
    // Create State Guide: 1) value -> set value, 2) null -> set null, 3) undefined -> remain previous value.
    const storeMapReducer = (action) => {
        let prev; // Intended to be undefined. -> undefined parameter will keep prev state.
        const {type, payload} = action;
        switch (type) {
            case MapActionType.PLAN_SELECT:
                return setStoreMap(createMapState(payload.planType, prev, prev, prev, prev, prev));
            case MapActionType.SUB_PLAN_SELECT:
                return setStoreMap(createMapState(prev, payload.subPlanType, prev, prev, prev, prev))
            case MapActionType.STATE_SELECT:
                return setStoreMap(createMapState(prev, prev, payload.stateType, prev, prev, prev))
            case MapActionType.STATE_UNSELECT:
                return setStoreMap(createMapState(prev, prev, StateType.NONE, [], prev, prev))
            case MapActionType.UPDATE_FILTER:
                return setStoreMap(createMapState(prev, prev, prev, payload.filters, prev, prev))
            case MapActionType.DISTRICT_HIGHLIGHT:
                return setStoreMap(createMapState(prev, prev, prev, prev, payload.districtId, prev))
            case MapActionType.MIXING_VALUE_CHANGE:
                return setStoreMap(createMapState(prev, prev, prev, prev, prev, payload.value))
            default:
                return storeMap;
        }
    }
    const storeDataReducer = (action) => {
        let prev; // Intended to be undefined. -> undefined parameter will keep prev state.
        const {type, payload} = action;
        switch (type) {
            case DataActionType.ADD_PLAN_TYPE:
                return setStoreData(createDataState(prev, prev, prev, prev, prev, payload.planKey, payload.planValue))
            case DataActionType.ADD_STATE_DATA:
                return setStoreData(createDataState(payload.planType, payload.stateType, payload.modelData, payload.geojson, prev, prev))
            case DataActionType.SET_DISTRICT_BOUND_DATA:
                return setStoreData(createDataState(prev, prev, prev, prev, payload.districtBoundData, prev, prev))
            default:
                return storeData;
        }
    }
    const storePageReducer = (action) => {
        let prev; // Intended to be undefined. -> undefined parameter will keep prev state.
        const {type, payload} = action;
        switch (type) {
            case PageActionType.UPDATE_TAB:
                return setStorePage(createPageState(payload.tabType))
            default:
                return storePage;
        }
    }

// --- STORE MAP FUNCTIONS -----------------------------

    storeMap.selectPlan = function(planType)
    {
        if (planType === storeMap.plan) return;

        storeMapReducer({
            type: MapActionType.PLAN_SELECT,
            payload: { planType: planType }
        })
    }

    storeMap.selectSubPlan = async function(planType)
    {
        if (storeMap.subPlan === planType || storeMap.plan === planType) return;
        console.log("in");
        storeMapReducer({
            type: MapActionType.SUB_PLAN_SELECT,
            payload: {subPlanType: planType}
        })
        await storeData.addStateData(planType, storeMap.state);
    }

    storeMap.selectState = async function(stateType)
    {
        storeMapReducer({
            type: MapActionType.STATE_SELECT,
            payload: {
                stateType: stateType,
            }
        })

        if (!storeMap.isPlanSelected()) return; // None of Plan selected -> ERROR: Should not be called.
        await storeData.addStateData(PlanType.Y2020, stateType);
        await storeData.addStateData(storeMap.plan, stateType);
    }


    // Move to country view
    // Reset added filter layers.
    storeMap.unselectState = function()
    {
        storeMapReducer({
            type: MapActionType.STATE_UNSELECT,
            payload: null,
        })
    }

    storeMap.addFilter = function(filterType)
    {
        let filters = storeMap.filters;
        filters.push(filterType);
        storeMapReducer({
            type: MapActionType.UPDATE_FILTER,
            payload: {filters: filters}
        })
    }

    storeMap.removeFilter = function(filterType)
    {
        let filters = storeMap.filters.filter((filter) => filter !== filterType)
        storeMapReducer({
            type: MapActionType.UPDATE_FILTER,
            payload: {filters: filters}
        })
    }

    storeMap.highlightDistrict = function(districtId)
    {
        if (storeMap.districtId === districtId)
        {
            districtId = -1; // remove highlight
        }
        storeMapReducer({
            type: MapActionType.DISTRICT_HIGHLIGHT,
            payload: {districtId: districtId}
        })
    }

    storeMap.mixingValueChange = function(value)
    {
        storeMapReducer({
            type: MapActionType.MIXING_VALUE_CHANGE,
            payload: {value: value},
        })
    }

// --- ENUM MODIFYING FUNCTIONS -----------------------------
    storeMap.addPlanTypeToEnum = function(keyValuePair)
    {
        PlanType[keyValuePair.key] = keyValuePair.value;
    }

// --- STORE DATA FUNCTIONS -----------------------------
    storeData.addPlanType = function(planKey, planValue)
    {
        if (planKey in storeData.planType) return;

        storeDataReducer({
            type: DataActionType.ADD_PLAN_TYPE,
            payload: {planKey: planKey, planValue: planValue},
        })
    }

    storeData.addStateData = async (planType, stateType) => {
        if (storeData.isStateDataReady(planType, stateType)) return;

        let geojson =  await apiGetStateGeojson(planType, stateType);
        let modelData =  await apiGetStateData(planType, stateType);

        storeDataReducer({
            type: DataActionType.ADD_STATE_DATA,
            payload: {planType: planType, stateType: stateType, geojson: geojson, modelData: modelData}
        })
    }

    storeData.setDistrictBoundData = function(districtBoundData)
    {
        storeDataReducer({
            type: DataActionType.SET_DISTRICT_BOUND_DATA,
            payload: districtBoundData,
        })
    }
// --- STORE PAGE FUNCTIONS -----------------------------
    storePage.selectTab = function(tabType)
    {
        storePageReducer({
            type: PageActionType.UPDATE_TAB,
            payload: { tabType: tabType }
        })
    }

// --- HELPER FUNCTIONS -----------------------------
    // STORE MAP
    storeMap.getMapPlan = () => { return storeMap.plan; }
    storeMap.getSubPlan = () => { return storeMap.subPlan; }
    storeMap.getState = () => { return storeMap.state; }
    storeMap.getHighlightDistrictId = () => { return storeMap.districtId; }
    storeMap.isPlanSelected = () => { return storeMap.plan !== null; }
    storeMap.isSubPlanSelected = () => { return storeMap.subPlan !== null; }
    storeMap.isStateChanged = () => { return storeMap.state !== storeMap.prevState; }
    storeMap.isStateNone = () => { return storeMap.state === StateType.NONE; }
    storeMap.isStateMatch = (stateType) => { return stateType === storeMap.state; }
    // STORE DATA
    storeData.getPlanType = () => { return storeData.planType; }
    storeData.getStateGeoJson = (planType, stateType) => { return storeData.geojson[planType][stateType]};
    storeData.getStateModelData = (planType, stateType) => { return storeData.modelData[planType][stateType]};
    storeData.getCurrentStateGeojson = (planType) => { return storeData.geojson[planType][storeMap.state]};
    storeData.isReadyToDisplayCurrentMap = () => {
        return storeData.isStateDataReady(storeMap.plan, storeMap.state);
    }
    storeData.isStateDataReady = (planType, stateType) => {
        return storeData.isModelDataReady(planType, stateType) && storeData.isGeojsonReady(planType, stateType);
    }
    storeData.isModelDataReady = (planType, stateType) => {
        if (!storeData.modelData[planType]) return false;
        if (!storeData.modelData[planType][stateType]) return false;
        return true;
    }
    storeData.isGeojsonReady = (planType, stateType) => {
        if (!storeData.geojson[planType]) return false;
        if (!storeData.geojson[planType][stateType]) return false;
        return true;
    }
    // STORE PAGE
    storePage.isTabMatch = (tabType) => { return tabType === storePage.tab; }


// --- API FUNCTIONS -----------------------------
    let apiGetStateGeojson = async (planType, stateType) =>
    {
        // TODO : return saved data if the data already in the storeMap.
        // TODO : remove if server api ready;
        if (planType === PlanType.Y2020)
            return GeoData[stateType][GeoDataType.DISTRICT];

        return await api.getStateGeoJson(planType, stateType);
    }

    let apiGetStateData = async (planType, stateType) =>
    {
        // TODO : return saved data if the data already in the storeMap.
        // TODO : Change into api if server api ready.
        return createStateModel(MockData(planType).data[stateType]);
    }

    return (
        <StoreContext.Provider value={{storeMap, storeData, storePage}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
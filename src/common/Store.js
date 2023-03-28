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
    SUB_PLAN_UNSELECT: "sub_plan_unselect",
    STATE_SELECT: "state_select",
    STATE_UNSELECT: "state_unselect",
    UPDATE_FILTER: "update_filter",
    DISTRICT_HOVER: "district_hover",
    MIXING_VALUE_CHANGE: "mixing_value_change",
}

export const DataActionType = {
    ADD_STATE_DATA: "add_state_data",
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
        district: -1,
        prevState: null,
        filters: [],
        mixingValue: -1,
    })
    const [storeData, setStoreData] = useState({
        modelData: {},
        geojson: {},
    })
    const [storePage, setStorePage] = useState({
        tab: TabType.MAP
    })
    console.log("Store");
// --- STATE HELPER ---------------------------------
    function createMapState(plan, stateType, subPlan, filters, district, mixingValue)
    {
        return {
            plan: (plan !== undefined)? plan : storeMap.plan,
            subPlan: (subPlan !== undefined)? subPlan : storeMap.subPlan,
            state: (stateType !== undefined)? stateType : storeMap.state,
            prevState: storeMap.state,
            filters: (filters !== undefined)? filters : storeMap.filters,
            district: district,
            mixingValue: (mixingValue !== undefined)? mixingValue : storeMap.mixingValue,
        }
    }
    function createDataState(planType, stateType, modelData, geojson)
    {
        let newData = storeData;
        newData.modelData[planType] = newData.modelData[planType] ?? {}; // set {} if null.
        newData.geojson[planType] = newData.geojson[planType] ?? {};

        newData.modelData[planType][stateType] = modelData;
        newData.geojson[planType][stateType] = geojson;

        return {
            modelData: newData.modelData,
            geojson: newData.geojson,
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
            case MapActionType.PLAN_UNSELECT:
                return setStoreMap(createMapState(storeMap.subPlan, prev, null, prev, prev, prev));
            case MapActionType.SUB_PLAN_SELECT:
                return setStoreMap(createMapState(prev, prev, payload.subPlanType, prev, prev, prev))
            case MapActionType.SUB_PLAN_UNSELECT:
                return setStoreMap(createMapState(prev, prev, null, prev, prev, prev))
            case MapActionType.STATE_SELECT:
                return setStoreMap(createMapState(prev, payload.stateType, prev, prev, prev, prev))
            case MapActionType.STATE_UNSELECT:
                return setStoreMap(createMapState(prev, StateType.NONE, prev, [], prev, prev))
            case MapActionType.UPDATE_FILTER:
                return setStoreMap(createMapState(prev, prev, prev, payload.filters, prev, prev))
            case MapActionType.DISTRICT_HOVER:
                return setStoreMap(createMapState(prev, prev, prev, prev, payload.district, prev))
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
            case DataActionType.ADD_STATE_DATA:
                return setStoreData(createDataState(payload.planType, payload.stateType, payload.modelData, payload.geojson))
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
        storeMapReducer({
            type: MapActionType.PLAN_SELECT,
            payload: { planType: planType }
        })
    }
    storeMap.unselectPlan = function()
    {
        // If only 1 plan is selected, plan can't be unselected.
        if (storeMap.isSubPlanSelected())
        {
            storeMapReducer({
                type: MapActionType.PLAN_UNSELECT,
                payload: null,
            })
        }
    }
    storeMap.selectSubPlan = async function(subPlanType)
    {
        storeMapReducer({
            type: MapActionType.SUB_PLAN_SELECT,
            payload: { subPlanType: subPlanType}
        })

        if (storeMap.isStateNone()) return;
        await storeData.addStateData(subPlanType, storeMap.state);
    }

    storeMap.unselectSubPlan = function()
    {
        storeMapReducer({
            type: MapActionType.SUB_PLAN_UNSELECT,
            payload: null
        })
    }

    storeMap.selectState = async function(stateType)
    {
        console.log("state selected")
        storeMapReducer({
            type: MapActionType.STATE_SELECT,
            payload: {
                stateType: stateType,
            }
        })

        if (!storeMap.isPlanSelected()) return; // None of Plan selected -> ERROR: Should not be called.
        await storeData.addStateData(storeMap.plan, stateType);

        if (!storeMap.isSubPlanSelected()) return;
        await storeData.addStateData(storeMap.subPlan, stateType);
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

    storeMap.hoverDistrict = function(district)
    {
        storeMapReducer({
            type: MapActionType.DISTRICT_HOVER,
            payload: {district: district}
        })
    }

    storeMap.mixingValueChange = function(value)
    {
        console.log(value);
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
    storeData.addStateData = async (planType, stateType) => {
        // if the state is already selected -> request data.
        let geojson =  await apiGetStateGeojson(planType, stateType);
        let modelData =  await apiGetStateData(planType, stateType);

        storeDataReducer({
            type: DataActionType.ADD_STATE_DATA,
            payload: {planType: planType, stateType: stateType, geojson: geojson, modelData: modelData}
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
    storeMap.getMapSubPlan = () => { return storeMap.subPlan; }
    storeMap.getState = () => { return storeMap.state; }
    storeMap.isStateChanged = () => { return storeMap.state !== storeMap.prevState; }
    storeMap.isStateNone = () => { return storeMap.state === StateType.NONE; }
    storeMap.isStateMatch = (stateType) => { return stateType === storeMap.state; }
    storeMap.isSubPlanSelected = () => { return storeMap.subPlan !== null; }
    storeMap.isPlanSelected = () => { return storeMap.plan !== null; }
    // STORE DATA
    storeData.getStateGeoJson = (planType, stateType) => { return storeData.geojson[planType][stateType]};
    storeData.getStateModelData = (planType, stateType) => { return storeData.modelData[planType][stateType]};
    storeData.getCurrentStateGeojson = (planType) => { return storeData.geojson[planType][storeMap.state]};
    storeData.isReadyToDisplayCurrentMap = () => {
        if (!storeMap.isSubPlanSelected()) return storeData.isStateDataReady(storeMap.plan, storeMap.state);
        return storeData.isStateDataReady(storeMap.plan, storeMap.state) && storeData.isStateDataReady(storeMap.subPlan, storeMap.state);
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
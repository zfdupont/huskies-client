import {createContext, useEffect, useState} from 'react';
import {StateType, FilterType, TabType, PlanType, GeoData, GeoDataType} from './Enums';
import MockData from './MockData';
import api from './api.js';
import {createStateModel} from "./ConversionHelper";
export const StoreContext = createContext({});

export const StoreActionType = {
    INIT_STORE: "init_store",
    PLAN_SELECT: "plan_select",
    PLAN_UNSELECT: "plan_unselect",
    SUB_PLAN_SELECT: "sub_plan_select",
    SUB_PLAN_UNSELECT: "sub_plan_unselect",
    STATE_SELECT: "state_select",
    STATE_UNSELECT: "state_unselect",
    ADD_COUNTRY_DATA: "add_country_data",
    ADD_STATE_DATA: "add_state_data",
    UPDATE_FILTER: "update_filter",
    UPDATE_TAB: "change_tab",
    DISTRICT_HOVER: "district_hover",
    MIXING_VALUE_CHANGE: "mixing_value_change",
}

// --- CONTEXT PROVIDER---------------------------------
function StoreContextProvider(props) {
    const [store, setStore] = useState({
        isReady: false,
        map: {
            plan: null,
            subPlan: null,
            state: StateType.NONE,
            district: -1,
            prevState: null,
            filters: [],
            mixingValue: -1,
        },
        data: {
        },
        geojson: {},
        tab: TabType.MAP
    })

// --- STATE HELPER ---------------------------------
    function createMapState(plan, stateType, subPlan, filters, district, mixingValue)
    {
        return {
            plan: (plan !== undefined)? plan : store.map.plan,
            subPlan: (subPlan !== undefined)? subPlan : store.map.subPlan,
            state: (stateType !== undefined)? stateType : store.map.state,
            prevState: store.map.state,
            filters: (filters !== undefined)? filters : store.map.filters,
            district: district,
            mixingValue: (filters !== undefined)? mixingValue : store.map.mixingValue,
        }
    }
    function createDataState(planType, stateType, stateData)
    {
        let newData = store.data;
        newData[planType] = newData[planType] ?? {}; // set {} if null.
        newData[planType][stateType] = stateData;
        return newData;
    }

    function createGeojsonState(planType, stateType, geojson)
    {
        let newGeojson = store.geojson;
        newGeojson[planType] = newGeojson[planType] ?? {}; // set {} if null.
        newGeojson[planType][stateType] = geojson;
        return newGeojson;
    }

// --- REDUCER ---------------------------------------
    // Create State Guide: 1) value -> set value, 2) null -> set null, 3) undefined -> remain previous value.
    const storeReducer = (action) => {
        let prev; // Intended to be undefined. -> undefined parameter will keep prev state.
        const {type, payload} = action;
        switch (type) {
            case StoreActionType.INIT_STORE:
                return setStore({
                    isReady: true,
                    map: store.map,
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.UPDATE_TAB:
                return setStore({
                    isReady: store.isReady,
                    map: store.map,
                    data: store.data,
                    geojson: store.geojson,
                    tab: payload.tabType,
                })
            case StoreActionType.PLAN_SELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(payload.planType, prev, prev, prev, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.PLAN_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(store.map.subPlan, prev, null, prev, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.SUB_PLAN_SELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, payload.subPlanType, prev, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.SUB_PLAN_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, null, prev, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.STATE_SELECT:
                console.log("State selected");
                setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, payload.stateType, prev, prev, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
                console.log(store);
                return;
            case StoreActionType.STATE_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, StateType.NONE, prev, [], prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.ADD_STATE_DATA:
                console.log("Data added");
                console.log(store.map);
                return setStore({
                    isReady: store.isReady,
                    map: store.map,
                    data: createDataState(payload.planType, payload.stateType, payload.stateData),
                    geojson: createGeojsonState(payload.planType, payload.stateType, payload.geojson),
                    tab: store.tab,
                })
            case StoreActionType.UPDATE_FILTER:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, payload.filters, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.DISTRICT_HOVER:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, prev, payload.district, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.MIXING_VALUE_CHANGE:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, prev, prev, payload.value),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            default:
                return store;
        }
    }

// --- REDUCER CALL FUNCTIONS ----------------------
    store.init = function()
    {
        storeReducer({
            type: StoreActionType.INIT_STORE,
            payload: null,
        })
    }

    store.selectPlan = function(planType)
    {
        storeReducer({
            type: StoreActionType.PLAN_SELECT,
            payload: { planType: planType }
        })
    }
    store.unselectPlan = function()
    {
        // If only 1 plan is selected, plan can't be unselected.
        if (store.isSubPlanSelected())
        {
            storeReducer({
                type: StoreActionType.PLAN_UNSELECT,
                payload: null,
            })
        }
    }
    store.selectSubPlan = async function(subPlanType)
    {
        storeReducer({
            type: StoreActionType.SUB_PLAN_SELECT,
            payload: { subPlanType: subPlanType}
        })

        if (store.isStateNone()) return;
        await store.addStateData(subPlanType, store.map.state);
    }

    store.unselectSubPlan = function()
    {
        storeReducer({
            type: StoreActionType.SUB_PLAN_UNSELECT,
            payload: null
        })
    }

    store.selectTab = function(tabType)
    {
        storeReducer({
            type: StoreActionType.UPDATE_TAB,
            payload: { tabType: tabType }
        })
    }
    store.selectState = async function(stateType)
    {
        setTimeout(async () => {
            storeReducer({
                type: StoreActionType.STATE_SELECT,
                payload: {
                    stateType: stateType,
                }
            })

            if (!store.isPlanSelected()) return; // None of Plan selected -> ERROR: Should not be called.
            await store.addStateData(store.map.plan, stateType);

            if (!store.isSubPlanSelected()) return;
            await store.addStateData(store.map.subPlan, stateType);
        }, 0);
    }

    store.addStateData = async (planType, stateType) => {
        // if the state is already selected -> request data.
        let geojson =  await store.apiGetStateGeojson(planType, stateType);
        let stateData =  await store.apiGetStateData(planType, stateType);

        storeReducer({
            type: StoreActionType.ADD_STATE_DATA,
            payload: {planType: planType, stateType: stateType, geojson: geojson, stateData: stateData}
        })
    }

    // Move to country view
    // Reset added filter layers.
    store.unselectState = function()
    {
        storeReducer({
            type: StoreActionType.STATE_UNSELECT,
            payload: null,
        })
    }

    store.addFilter = function(filterType)
    {
        let filters = store.map.filters;
        filters.push(filterType);
        storeReducer({
            type: StoreActionType.UPDATE_FILTER,
            payload: {filters: filters}
        })
    }

    store.removeFilter = function(filterType)
    {
        let filters = store.map.filters.filter((filter) => filter !== filterType)
        storeReducer({
            type: StoreActionType.UPDATE_FILTER,
            payload: {filters: filters}
        })
    }

    store.hoverDistrict = function(district)
    {
        storeReducer({
            type: StoreActionType.DISTRICT_HOVER,
            payload: {district: district}
        })
    }

    store.onMapMixingValueChange = function(value)
    {
        storeReducer({
            type: StoreActionType.MIXING_VALUE_CHANGE,
            payload: {value: value},
        })
    }

// --- ENUM MODIFYING FUNCTIONS -----------------------------
    store.addPlanTypeToEnum = function(keyValuePair)
    {
        PlanType[keyValuePair.key] = keyValuePair.value;
    }
// --- HELPER FUNCTIONS -----------------------------
    store.getMapPlan = () => { return store.map.plan; }
    store.getMapSubPlan = () => { return store.map.subPlan; }
    store.getCurrentStateGeojson = (planType) => { return store.geojson[planType][store.map.state]}
    store.isTabMatch = (tabType) => { return tabType === store.tab; }
    store.isStateChanged = () => { return store.map.state !== store.map.prevState; }
    store.isStateNone = () => { return store.map.state === StateType.NONE; }
    store.isStateMatch = (stateType) => { return stateType === store.map.state; }
    store.isGeojsonUpdated = (plan, stateType) => { return store.geojson[plan]?.[stateType] !== undefined;}
    store.isSubPlanSelected = () => { return store.map.subPlan !== null; }
    store.isPlanSelected = () => { return store.map.plan !== null; }
    store.isStateDataReady = () => {
        if (!store.data[store.map.plan]?.[store.map.state]) return false;
        if (!store.isSubPlanSelected()) return true;
        if (!store.data[store.map.subPlan]?.[store.map.state]) return false;
        return true;
    }

// --- API FUNCTIONS -----------------------------
    store.apiGetStateGeojson = async (planType, stateType) =>
    {
        // TODO : return saved data if the data already in the store.
        // TODO : remove if server api ready;
        if (planType === PlanType.Y2020)
            return GeoData[stateType][GeoDataType.DISTRICT];

        return await api.getStateGeoJson(planType, stateType);
    }

    store.apiGetStateData = async (planType, stateType) =>
    {
        // TODO : return saved data if the data already in the store.
        // TODO : Change into api if server api ready.
        return createStateModel(MockData(planType).data[stateType]);
    }

    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
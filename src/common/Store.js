import { createContext, useState } from 'react';
import {StateType, FilterType, TabType, PlanType} from './Enums';
import MockData from './MockData';
import api from './api.js';
import {createMap} from "leaflet/src/map/Map";
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
    DISTRICT_HOVER: "district_hover"
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
        },
        data: {
        },
        geojson: {},
        tab: TabType.MAP
    })

// --- STATE HELPER ---------------------------------
    function createMapState(plan, stateType, subPlan, filters, district)
    {
        return {
            plan: (plan !== undefined)? plan : store.map.plan,
            subPlan: (subPlan !== undefined)? subPlan : store.map.subPlan,
            state: (stateType !== undefined)? stateType : store.map.state,
            prevState: store.map.state,
            filters: (filters !== undefined)? filters : store.map.filters,
            district: district
        }
    }
    function createDataState(plan, stateType, stateData)
    {
        let newData = store.data;
        if (!newData[plan]) newData[plan] = {};
        newData[plan][stateType] = stateData;
        return newData;
    }

    function createGeojsonState(plan, stateType, stateGeojson)
    {
        let newGeojson = store.geojson;
        if (!newGeojson[plan]) newGeojson[plan] = {};
        newGeojson[plan][stateType] = stateGeojson;
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
                    map: createMapState(payload.planType, prev, prev, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.PLAN_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(store.map.subPlan, prev, null, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.SUB_PLAN_SELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, payload.subPlanType, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.SUB_PLAN_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, null, prev, prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.STATE_SELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, payload.stateType, prev, prev, prev),
                    data: createDataState(store.map.plan, payload.stateType, payload.stateData),
                    geojson: createGeojsonState(store.map.plan, payload.stateType, payload.geojson),
                    tab: store.tab,
                })
            case StoreActionType.STATE_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, StateType.NONE, prev, [], prev),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.ADD_COUNTRY_DATA:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, prev, prev),
                    data: createDataState(),
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.UPDATE_FILTER:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, payload.filters),
                    data: store.data,
                    geojson: store.geojson,
                    tab: store.tab,
                })
            case StoreActionType.DISTRICT_HOVER:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, prev, payload.district),
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
    store.selectSubPlan = function(subPlanType)
    {
        storeReducer({
            type: StoreActionType.SUB_PLAN_SELECT,
            payload: { subPlanType: subPlanType}
        })
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
        let promise = api.getStateGeoJson(stateType);
        let geojson;
        if (store.isGeojsonUpdated(store.map.plan, stateType))
        {
            console.log("cached state data used.");
            geojson = store.geojson[store.map.plan][stateType];
        }
        else
        {
            geojson = await promise.then((result) => {
                return result;
            });
        }
        let stateModel = createStateModel(MockData(2022).data["newyork"]);

        storeReducer({
            type: StoreActionType.STATE_SELECT,
            payload: {
                stateType: stateType,
                stateData: stateModel,
                geojson: geojson,
            }
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
            payload: { district }
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
    store.getCurrentStateGeojson = () => { return store.geojson[store.map.plan][store.map.state]}
    store.isTabMatch = (tabType) => { return tabType === store.tab; }
    store.isStateChanged = () => { return store.map.state !== store.map.prevState; }
    store.isStateNone = () => { return store.map.state === StateType.NONE; }
    store.isStateMatch = (stateType) => { return stateType === store.map.state; }
    store.isGeojsonUpdated = (plan, stateType) => { return store.geojson[plan]?.[stateType] !== undefined;}
    store.isSubPlanSelected = () => { return store.map.subPlan !== null; }
    store.isPlanSelected = () => { return store.map.plan !== null; }

    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
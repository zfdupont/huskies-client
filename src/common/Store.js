import { createContext, useState } from 'react';
import {StateType, FilterType, TabType} from './Enums';
import {createCountryModel} from "./TypeConvertHelper";
import MockData from './MockData';
import api from './api.js';
export const StoreContext = createContext({});

export const StoreActionType = {
    INIT_STORE: "init_store",
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
            plan: "2022",
            state: StateType.NONE,
            district: -1,
            prevState: null,
            subPlan: null,
            filters: [],
        },
        data: {
            "2022": createCountryModel(MockData("2022")),
            "2020": createCountryModel(MockData("2020")),
        },
        tab: TabType.MAP
    })

// --- STATE HELPER ---------------------------------
    function createMapState(plan, stateType, subPlan, filters, district)
    {
        return {
            plan: (plan !== undefined)? plan : store.map.plan,
            state: (stateType !== undefined)? stateType : store.map.state,
            prevState: store.map.state,
            subPlan: (subPlan !== undefined)? subPlan : store.map.subPlan,
            filters: (filters !== undefined)? filters : store.map.filters,
            district: district
        }
    }
    function createDataState(newCountryModel)
    {
        let newData = store.data;
        newData[newCountryModel.plan] = newCountryModel;
        return newData;
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
                    tab: store.tab,
                })
            case StoreActionType.UPDATE_TAB:
                return setStore({
                    isReady: store.isReady,
                    map: store.map,
                    data: store.data,
                    tab: payload.tabType,
                })
            case StoreActionType.STATE_SELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, payload.stateType, prev, prev, prev),
                    data: store.data,
                    tab: store.tab,
                })
            case StoreActionType.STATE_UNSELECT:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, StateType.NONE, prev, [], prev),
                    data: store.data,
                    tab: store.tab,
                })
            case StoreActionType.ADD_COUNTRY_DATA:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, prev, prev),
                    data: createDataState(payload.countryModel),
                    tab: store.tab,
                })
            case StoreActionType.UPDATE_FILTER:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, payload.filters),
                    data: store.data,
                    tab: store.tab,
                })
            case StoreActionType.DISTRICT_HOVER:
                return setStore({
                    isReady: store.isReady,
                    map: createMapState(prev, prev, prev, prev, payload.district),
                    data: store.data,
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

    store.selectTab = function(tabType)
    {
        storeReducer({
            type: StoreActionType.UPDATE_TAB,
            payload: { tabType: tabType }
        })
    }

    store.selectState = function(stateType)
    {
        storeReducer({
            type: StoreActionType.STATE_SELECT,
            payload: { stateType: stateType }
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

// --- HELPER FUNCTIONS -----------------------------
    store.isTabMatch = (tabType) => { return tabType === store.tab; }
    store.getMapPlan = () => { return store.map.plan; }
    store.isStateChanged = () => { return store.map.state !== store.map.prevState; }
    store.isStateNone = () => { return store.map.state === StateType.NONE; }
    store.isStateMatch = (stateType) => { return stateType === store.map.state; }

// --- SERVER REQUEST -------------------------------
    store.getStateData = function()
    {

        let countryJson = api.getAllStatesData(StateType.GEORGIA);
        console.log(countryJson);
        if (countryJson === null)
        {
            countryJson = MockData(2022);
        }
        let countryModel = createCountryModel(countryJson);

        storeReducer({
            type: StoreActionType.ADD_COUNTRY_DATA,
            payload: {
                countryModel: countryModel,
            }
        })
    }


    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
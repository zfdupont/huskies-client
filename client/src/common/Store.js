import { createContext, useState } from 'react';
import dummyData1 from '../0.data/dummyData1.json';
import dummyData2 from '../0.data/dummyData2.json';
import CountryModel from "../models/CountryModel";
import StateModel from "../models/StateModel";
import DistrictModel from "../models/DistrictModel";
import DemographicModel from "../models/DemographicModel";
import {StateType, FilterType, TabType} from './Enums';
import MockData from './MockData';
export const StoreContext = createContext({});

export const StoreActionType = {
    STATE_SELECT: "state_select",
    STATE_UNSELECT: "state_unselect",
    ADD_STATE_DATA: "add_state_data",
    UPDATE_FILTER: "update_filter",
    UPDATE_TAB: "change_tab",
    DISTRICT_HOVER: "district_hover"
}

function setStyle(store)
{
    store.sx = {
        drawerList: {
            mainFontSize: '14px',
            subFontSize: '12px'
        }
    }
}

function StoreContextProvider(props) {
    const [store, setStore] = useState({
        map: {
            plan: "2022",
            state: StateType.NONE,
            district: 1,
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
    setStyle(store);
// --- STATE HELPER ---------------------------------
    function createMapState(plan, stateType, subPlan, filters, district=1)
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
    function createDataState(plan, stateType, data)
    {
    }
    function createCountryModel(countryJsonData)
    {
        console.log(countryJsonData)
        let plan = countryJsonData.plan;
        let stateModels = {};
        for (const stateKey in countryJsonData.data)
            stateModels[stateKey] = createStateModel(countryJsonData.data[stateKey]);
        return new CountryModel(plan, stateModels);
    }
    function createStateModel(stateJsonData)
    {
        let name = stateJsonData.name;
        let districtModels = {};
        for (const districtKey in stateJsonData.districts)
            districtModels[districtKey] = createDistrictModel(stateJsonData.districts[districtKey])
        return new StateModel(name, districtModels);
    }
    function createDistrictModel(districtJsonData)
    {
       return new DistrictModel(
           districtJsonData.id,
           districtJsonData.party,
           createDemographicModel(districtJsonData.population, districtJsonData.votes)
       )
    }
    function createDemographicModel(populationJsonData, votesJsonData)
    {
        return new DemographicModel(populationJsonData,votesJsonData)
    }

// --- REDUCER ---------------------------------------
    // Create State Guide: 1) value -> set value, 2) null -> set null, 3) undefined -> remain previous value.
    const storeReducer = (action) => {
        let prev; // It must be undefined. -> undefined parameter will keep prev state.
        const {type, payload} = action;
        switch (type) {
            case StoreActionType.UPDATE_TAB:
                return setStore({
                    map: store.map,
                    data: store.data,
                    tab: payload.tabType,
                })
            case StoreActionType.STATE_SELECT:
                return setStore({
                    map: createMapState(prev, payload.stateType, prev, prev),
                    data: store.data,
                    tab: store.tab,
                })
            case StoreActionType.STATE_UNSELECT:
                return setStore({
                    map: createMapState(prev, StateType.NONE, prev, []),
                    data: store.data,
                    tab: store.tab,
                })
            case StoreActionType.UPDATE_FILTER:
                return setStore({
                    map: createMapState(prev, prev, prev, payload.filters),
                    data: store.data,
                    tab: store.tab,
                })
            case StoreActionType.DISTRICT_HOVER:
                return setStore({
                    map: createMapState(prev, prev, prev, prev, payload.district),
                    data: store.data,
                    tab: payload.tabType,
                })
            default:
                return store;
        }
    }

// --- REDUCER CALL FUNCTIONS ----------------------
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
    store.addStateData = function(countryDataJson)
    {
        store[countryDataJson.plan] = countryDataJson.data;
    }

    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
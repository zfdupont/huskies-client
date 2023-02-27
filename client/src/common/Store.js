import { createContext, useState } from 'react';
import dummyData1 from '../0.data/dummyData1.json';
import dummyData2 from '../0.data/dummyData2.json';
import CountryModel from "../models/CountryModel";
import StateModel from "../models/StateModel";
import DistrictModel from "../models/DistrictModel";
import PopulationModel from "../models/PopulationModel";
export const StoreContext = createContext({});

export const StateType = {
    NONE: "none",
    NEWYORK: "newyork",
    GEORGIA: "georgia",
    ILLINOIS: "illinois",
}

export const StoreActionType = {
    STATE_SELECT: "state_select",
    STATE_UNSELECT: "state_unselect",
    ADD_STATE_DATA: "add_state_data",
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
            prevState: null,
            subPlan: null,
        },
        data: {
            "2022": createCountryModel(dummyData1),
            "2020": createCountryModel(dummyData2),
        }
    })
    setStyle(store);

// --- STATE HELPER ---------------------------------
    function createMapState(plan, stateType, subPlan)
    {
        return {
            plan: (plan !== undefined)? plan : store.map.plan,
            state: (stateType !== undefined)? stateType : store.map.state,
            prevState: store.map.state,
            subPlan: (subPlan !== undefined)? subPlan : store.map.subPlan,
        }
    }
    function createDataState(plan, stateType, data)
    {
        let curData = store.data;
        curData[plan][stateType] = data;
        return curData
    }
    function createCountryModel(countryJsonData)
    {
        let plan = countryJsonData.plan;
        let stateModels = [];
        for (const stateKey in countryJsonData.data)
            stateModels.push(createStateModel(countryJsonData.data[stateKey]))
        return new CountryModel(plan, stateModels);
    }
    function createStateModel(stateJsonData)
    {
        let name = stateJsonData.name;
        let districtModels = [];
        for (const districtKey in stateJsonData.districts)
            districtModels.push(createDistrictModel(stateJsonData.districts[districtKey]))
        return new StateModel(name, districtModels);
    }
    function createDistrictModel(districtJsonData)
    {
       return new DistrictModel(
           districtJsonData.id,
           districtJsonData.party,
           createPopulationModel(districtJsonData.population)
       )
    }
    function createPopulationModel(populationJsonData)
    {
        return new PopulationModel(
            populationJsonData.total,
            populationJsonData.democrats,
            populationJsonData.republicans,
        )
    }

// --- REDUCER ---------------------------------------
    // Create State Guide: 1) value -> set value, 2) null -> set null, 3) undefined -> remain previous value.
    const storeReducer = (action) => {
        let prev; // It must be undefined.
        const {type, payload} = action;
        switch (type) {
            case StoreActionType.STATE_SELECT:
                return setStore({
                    map: createMapState(prev, payload.stateType, prev)
                })
            case StoreActionType.STATE_UNSELECT:
                return setStore({
                    map: createMapState(prev, StateType.NONE, prev)
                })
            case StoreActionType.ADD_STATE_DATA:
                return setStore({
                    map: createMapState(prev, prev, prev),
                    data: createDataState(payload.plan, payload.stateType, payload.data)
                })
            default:
                return store;
        }
    }

// --- REDUCER CALL FUNCTIONS ----------------------
    store.selectState = function(stateType)
    {
        storeReducer({
            type: StoreActionType.STATE_SELECT,
            payload: {
                stateType: stateType
            }
        })
    }

    store.unselectState = function()
    {
        storeReducer({
            type: StoreActionType.STATE_UNSELECT,
            payload: null,
        })
    }

// --- HELPER FUNCTIONS -----------------------------

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
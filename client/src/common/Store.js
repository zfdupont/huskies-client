import { createContext, useState } from 'react';
export const StoreContext = createContext({});

export const StateType = {
    NEWYORK: "newyork",
    GEORGIA: "georgia",
    ILLINOIS: "illinois",
}

export const StoreActionType = {
    STATE_SELECT: "state_select",
    STATE_UNSELECT: "state_unselect"
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
            state: null,
            plan: 2022,
            subPlan: null,
        }
    })
    setStyle(store);
    function createMapState(state, plan, subPlan)
    {
        return {
            state: (state !== undefined)? state : store.map.state,
            plan: (plan !== undefined)? plan : store.map.plan,
            subPlan: (subPlan !== undefined)? subPlan : store.map.subPlan,
        }
    }

    // Create State Guide: 1) value -> set value, 2) null -> set null, 3) undefined -> remain previous value.
    const storeReducer = (action) => {
        let prev; // It must be undefined.
        const {type, payload} = action;
        switch (type) {
            case StoreActionType.STATE_SELECT:
                return setStore({
                    map: createMapState(payload.stateType,prev, prev)
                })
            case StoreActionType.STATE_UNSELECT:
                return setStore({
                    map: createMapState(null, prev, prev)
                })
            default:
                return store;
        }
    }

// Reducer Functions Area
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

// Normal Functions Area
    store.isStateNull = function()
    {
        return store.map.state == null;
    }

    store.getMapPlan = () => {return store.map.plan;}

    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
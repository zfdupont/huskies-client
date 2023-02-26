import { createContext, useState } from 'react';
export const StoreContext = createContext({});

export const StateType = {
    NONE: "none",
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
            state: StateType.NONE,
            prevState: null,
            plan: 2022,
            subPlan: null,
        }
    })
    setStyle(store);
// --- STATE HELPER ---------------------------------
    function createMapState(state, plan, subPlan)
    {
        return {
            state: (state !== undefined)? state : store.map.state,
            prevState: store.map.state,
            plan: (plan !== undefined)? plan : store.map.plan,
            subPlan: (subPlan !== undefined)? subPlan : store.map.subPlan,
        }
    }

// --- REDUCER ---------------------------------------
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
                    map: createMapState(StateType.NONE, prev, prev)
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
    store.isStateNull = () => { return store.map.state === StateType.NONE; }

    store.getMapPlan = () => { return store.map.plan; }

    store.isStateChanged = () => { return store.map.state !== store.map.prevState; }

    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
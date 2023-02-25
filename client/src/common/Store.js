import { createContext, useState } from 'react';
export const StoreContext = createContext({});

export const StateType = {
    NEWYORK: "newyork",
    GEORGIA: "georgia",
    ILLINOIS: "illinois",
}

export const StoreActionType = {
    DEFAULT: "default"
}

function StoreContextProvider(props) {
    const [store, setStore] = useState({
        state: StateType.NEWYORK,
        plan: 2022,
    })

    store.sx = {
        drawerList: {
            mainFontSize: '14px',
            subFontSize: '12px'
        }
    }
    const storeReducer = (action) => {
        const {type, payload} = action;
        switch (type) {
            case StoreActionType.DEFAULT:
                return setStore({
                    state: store.state,
                    plan: store.plan
                })
            default:
                return store;
        }
    }

    store.test = function()
    {
        console.log("this is store test.");
    }

    return (
        <StoreContext.Provider value={{store}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContext;
export { StoreContextProvider }
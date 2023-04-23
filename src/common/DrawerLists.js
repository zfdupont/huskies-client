import * as React from "react";
import { useContext } from 'react';
import StateList from './StateList'
import PlanList from './PlanList'
import MultiPlanList from './MultiPlanList.js'
import MapFilterList from './MapFilterList'
import StoreContext from './Store'
import {TabType} from "./Enums";

export default function DrawerLists() {
    const { storeMap, storePage } = useContext(StoreContext);
    return (
        <div>
            <StateList/>
            <PlanList/>
            { !storeMap.isStateNone() && <MultiPlanList/>}
            { !storeMap.isStateNone() && storePage.isTabMatch(TabType.MAP) && <MapFilterList/>}
        </div>
    );
}
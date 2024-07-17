import * as React from "react";
import { useContext } from 'react';
import StateList from './StateList'
import PlanList from './PlanList'
import MultiPlanList from './MultiPlanList'
import MapFilterList from './MapFilterList'
import StoreContext from './Store'
import {TabType} from "./GlobalVariables";

export default function DrawerLists() {
    const { mapStore, pageStore } = useContext(StoreContext);
    return (
        <div>
            <StateList/>
            <PlanList/>
            { !mapStore.isStateNone() && <MultiPlanList/>}
            { !mapStore.isStateNone() && pageStore.isTabMatch(TabType.MAP) && <MapFilterList/>}
        </div>
    );
}
import * as React from "react";
import { useContext } from 'react';
import StateList from './StateList'
import PlanList from './PlanList'
import MultiPlanList from './MultiPlanList'
import MapFilterList from './MapFilterList'
import StoreContext from './Store'

export default function DrawerLists() {
    const { mapStore } = useContext(StoreContext);
    return (
        <div>
            <StateList/>
            <PlanList/>
            { !mapStore.isStateNone() && <MultiPlanList/>}
            { !mapStore.isStateNone() && <MapFilterList/>}
        </div>
    );
}
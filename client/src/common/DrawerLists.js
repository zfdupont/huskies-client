import Accordion from "./StateList";
import * as React from "react";
import { useContext } from 'react';
// Custom
import FilterList from './FilterList'
import StateList from './StateList'
import PlanList from './PlanList'
import StoreContext from './Store'

export default function DrawerLists()
{
    const {store} = useContext(StoreContext);



    return (
        <div>
            <PlanList/>
            <StateList/>
            { !store.isStateNone() && <FilterList/>}
        </div>
    );
}
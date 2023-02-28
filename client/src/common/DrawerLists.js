import Accordion from "./StateList";
import * as React from "react";
import { useContext } from 'react';
// Custom
import FilterList from './FilterList'
import StateList from './StateList'
import PlanList from './PlanList'
import StoreContext from './Store'
import {TabType} from "./Enums";

export default function DrawerLists()
{
    const {store} = useContext(StoreContext);

    console.log(store);
    return (
        <div>
            <PlanList/>
            <StateList/>
            { !store.isStateNone() && store.isTabMatch(TabType.MAP) && <FilterList/>}
        </div>
    );
}
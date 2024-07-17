import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useContext} from "react";
import StoreContext from "../../common/Store";

export default function Analysis() {

    const { mapStore } = useContext(StoreContext);
    console.log(mapStore.getState());
    const state = mapStore.getState();

    const StateType = {
        NY: "New York’s redistricting process started out controlled by the Democrat supermajority in New York’s legislature. However, their district plans were thrown out by the courts for gerrymandering. Afterwards, special master Jonathan Cervas was appointed by the court to adjust the district plan, creating a plan that ultimately pitted two Democratic incumbents against each other and created multiple swing districts.",
        GA: "Georgia’s redistricting process was controlled by Republicans. Notably, two democrat-favored districts in the Atlanta suburbs were combined into one, pitting Democrat incumbents Lucy McBath and Carolyn Bourdeaux against each other. Overall, the plan created an additional Republican-favored district compared to the previous district plan.",
        IL: "Illinois’s redistricting process was controlled by the Democrats. They drew a map to give Democrats one more Democrat-favored seat compared to 2020. Each party also faced an incumbent vs incumbent primary in 2022 as a result of the drawn district plan."
    }

    const StateNames = {
        NY: "New York",
        GA: "Georgia",
        IL: "Illinois",
    }

   // let ensembleTable = getEnsembleSummaryData();

    




    return (
        <div>
            <h1>{StateNames[mapStore.getState()]}</h1>
            <p>
            {StateType[mapStore.getState()]}
            </p>
        </div>
    )
}
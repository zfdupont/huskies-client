import { useContext } from "react";
import StoreContext from "../../common/Store";
import { StateType } from "../../common/GlobalVariables";
import SummaryEnsembleTable from "./SummaryEnsembleTable";
import BoxAndWhiskerChart from "./BoxAndWhiskerChart";

const STATE_NAMES = {
    [StateType.NEWYORK]: "New York",
    [StateType.GEORGIA]: "Georgia",
    [StateType.ILLINOIS]: "Illinois",
};

const STATE_NARRATIVES = {
    [StateType.NEWYORK]: "New York’s redistricting process started out controlled by the Democrat supermajority in New York’s legislature. However, their district plans were thrown out by the courts for gerrymandering. Afterwards, special master Jonathan Cervas was appointed by the court to adjust the district plan, creating a plan that ultimately pitted two Democratic incumbents against each other and created multiple swing districts.",
    [StateType.GEORGIA]: "Georgia’s redistricting process was controlled by Republicans. Notably, two democrat-favored districts in the Atlanta suburbs were combined into one, pitting Democrat incumbents Lucy McBath and Carolyn Bourdeaux against each other. Overall, the plan created an additional Republican-favored district compared to the previous district plan.",
    [StateType.ILLINOIS]: "Illinois’s redistricting process was controlled by the Democrats. They drew a map to give Democrats one more Democrat-favored seat compared to 2020. Each party also faced an incumbent vs incumbent primary in 2022 as a result of the drawn district plan.",
};

export default function AnalyzePanel() {
    const { mapStore, dataStore } = useContext(StoreContext);

    if (mapStore.isStateNone()) {
        return (
            <div style={{ padding: "20px", color: "white" }}>
                <p>Select a state to see its analysis.</p>
            </div>
        );
    }

    const state = mapStore.getState();

    const ensembleData = dataStore.isEnsemblejsonReady() ? dataStore.getEnsembleData() : null;
    const boxWhiskerData = ensembleData?.box_w_data;
    // enacted_data (the "actual variation" scatter overlay) is optional; the box
    // plot renders from box_w_data alone when the backend omits it.
    const enactedData = ensembleData?.enacted_data;

    return (
        <div style={{ padding: "20px", color: "white", overflow: "auto", height: "100%" }}>
            <h1>{STATE_NAMES[state]}</h1>
            <p>{STATE_NARRATIVES[state]}</p>
            <SummaryEnsembleTable />
            {boxWhiskerData && (
                <div style={{ background: "white", borderRadius: 4, padding: 8, marginTop: 20, width: "fit-content" }}>
                    <BoxAndWhiskerChart data={boxWhiskerData} enactedData={enactedData} />
                </div>
            )}
        </div>
    );
}


import * as React from "react";
import Whisker from "./Whisker.tsx";
import {useContext, useState} from "react";
import StoreContext from "../../common/Store";
import TestChart from "./TestChart";

const ChartButtonType = {
    BW: "box-and-whisker",
    BAR: "barchart"
}

export default function ChartBox()
{
    const { dataStore } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedChart: ChartButtonType.BW,
        dataReady: false
    });
    //console.log(dataStore.ensemble);
    let bw_data = getBoxAndWhiskerData();
    console.log(bw_data);

    function getBoxAndWhiskerData() {
        let bw_data = {};
        if (!dataStore.isEnsemblejsonReady()) return bw_data;
        bw_data = dataStore.getEnsembleData().box_w_data;
        setState((prevState) => ({...prevState, dataReady: true}));
        return bw_data;
    }

    function box_and_whisker() {
        if(!state.dataReady) {
            return null;
        }
        return <TestChart data={bw_data}></TestChart>;
    }

    return (
        <div>
           {state.dataReady ? (
                <div>
                    <TestChart data={bw_data}></TestChart>
                </div>
            ) : null}
        </div>
    );
}
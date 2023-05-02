
import * as React from "react";
import Whisker from "./Whisker.tsx";
import {useContext, useState, useEffect} from "react";
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
        dataReady: false,
        data: {}
    });
    //var bwdata = getBoxAndWhiskerData();
    //console.log(dataStore.ensemble);
      useEffect(() => {
        //let bwdata = getBoxAndWhiskerData();
        //console.log(state);
    });
    
    let boxWhiskerChart = getDistrictSummaryInfo();

    function getDistrictSummaryInfo() {
        const boxWhiskerChart = [];
        if (!dataStore.isEnsemblejsonReady()) return boxWhiskerChart;
        //let stateModelData = dataStore.getStateModelData(mapStore.getMapPlan(), mapStore.getState());
        let bw_data = dataStore.getEnsembleData().box_w_data;
        if(bw_data) {
            boxWhiskerChart.push(<TestChart key={1} data={bw_data}/>);
        }
        console.log(bw_data);
        // for (let id in stateModelData.electionDataDict) {
        //     if (state.incumbentFilter && !stateModelData.electionDataDict[id].hasIncumbent) continue;

        //     boxWhiskerChart.push(<TestChart data={bw_data}} />);
        //     boxWhiskerChart.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]}/>);
        // }
        return boxWhiskerChart;
    }


    function getBoxAndWhiskerData() {
        let bw_data = {};
        if (!dataStore.isEnsemblejsonReady()) return;
        bw_data = dataStore.getEnsembleData().box_w_data;
        setState((prevState) => ({...prevState, dataReady: true, data: bw_data}));
        return bw_data;
        //return bw_data;
       // return bw_data;
    }

    function box_and_whisker() {
        // if(!state.dataReady) {
        //     return null;
        // }
        // return <TestChart data={bw_data}></TestChart>;
    }

    return (
        <div>
           {/* {state.dataReady ? (
                <div>
                    <TestChart data={state.data}></TestChart>
                </div>
            ) : <div></div>} */}
            {/* {bwdata} */}
            {boxWhiskerChart}
        </div>
    );
}
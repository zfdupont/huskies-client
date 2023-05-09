
import * as React from "react";
import Whisker from "./Whisker.tsx";
import {useContext, useState, useEffect} from "react";
import StoreContext from "../../common/Store";
import BoxAndWhiskerChart from "./BoxAndWhiskerChart";
import BarChart from "./BarChart";
import SafeSeats from "./SafeSeats";
import { Stack, Paper, MenuList, MenuItem } from "@mui/material";

const ChartButtonType = {
    BW: "box-and-whisker",
    SAFE: 'safe-seats',
    BAR: "barchart"
}

export default function ChartBox()
{
    const { mapStore, dataStore } = useContext(StoreContext);
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
        let stateModelData = dataStore.getStateModelData(mapStore.getMapPlan(), mapStore.getState());
        let allGraphData = dataStore.getEnsembleData();
        let safeSeatsData = generateSafeSeatsData(stateModelData.electionDataDict);
        let winnerSplits = generateWinnerSplitsData(allGraphData.winner_split, allGraphData['enacted_data'].winner_split);
        let bw_data = allGraphData.box_w_data;
        console.log(winnerSplits);
        if(bw_data) {
            boxWhiskerChart.push(<BoxAndWhiskerChart key={1} data={bw_data}/>);
        }
        if(safeSeatsData) {
            boxWhiskerChart.push(<SafeSeats key={2} data={safeSeatsData}/>);
        }
        if(winnerSplits) {
            console.log(winnerSplits);
            boxWhiskerChart.push(<BarChart key={3} data={winnerSplits}/>);
        }
        //console.log(bw_data);
        // for (let id in stateModelData.electionDataDict) {
        //     if (state.incumbentFilter && !stateModelData.electionDataDict[id].hasIncumbent) continue;

        //     boxWhiskerChart.push(<TestChart data={bw_data}} />);
        //     boxWhiskerChart.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]}/>);
        // }
        return boxWhiskerChart;
    }

    function generateBarChartData(incumbent_data) {
        //structure --> {incumbent: [{change in range: count, ...}]}
    }

    function onChartButtonClick() {
        //when we're trying to change the chart
        //ahh how should we do this...load all data at the beginning and then load charts as necessary?
        //or request data when needed? it's already being computed anyways so it makes more sense to
        //to load all at once...
    }

    function generateWinnerSplitsData(calculated_splits, actual_split) {
        calculated_splits[actual_split] =[1, 'enacted'];
        return calculated_splits;
    }

    function generateSafeSeatsData(election_data) {
        let safe_seats_data = {'incumbent': 0, 'open_seat': 0, 'dem-incmb': 0, 'rep-incmb': 0, 'dem-open': 0, 'rep-open': 0};
        for (let id in election_data) {
            let district = election_data[id];
            if (district.hasIncumbent) {
                safe_seats_data['incumbent'] +=1;
                if(district.winnerParty === 'democratic') {
                    safe_seats_data['dem-incmb'] += 1;
                }
                else {
                    safe_seats_data['rep-incmb'] += 1;
                }
            } 
            else {
                safe_seats_data['open_seat'] += 1;
                if(district.winnerParty === 'democratic') {
                    safe_seats_data['dem-open'] += 1;
                }
                else {
                    safe_seats_data['rep-open'] += 1;
                }
            } 
        }
        //console.log(safe_seats_data);
        return safe_seats_data;
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
            <Stack direction="row" spacing={2}>
                {/* <Paper>
                    <MenuList>
                        <MenuItem>Profile</MenuItem>
                        <MenuItem>My account</MenuItem>
                        <MenuItem>Logout</MenuItem>
                    </MenuList>
                </Paper> */}

                {boxWhiskerChart[2]}
             </Stack>
           {/* {state.dataReady ? (
                <div>
                    <TestChart data={state.data}></TestChart>
                </div>
            ) : <div></div>} */}
            {/* {bwdata} */}
            {/* {boxWhiskerChart[2]} */}
            {/* {boxWhiskerChart[1]} */}
            {/* <BarChart></BarChart> */}
            {/* <SafeSeats></SafeSeats> */}
        </div>
    );
}
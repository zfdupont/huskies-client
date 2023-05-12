
import * as React from "react";
import Whisker from "./Whisker.tsx";
import {useContext, useState, useEffect} from "react";
import StoreContext from "../../common/Store";
import BoxAndWhiskerChart from "./BoxAndWhiskerChart";
import BarChart from "./BarChart";
import SafeSeats from "./SafeSeats";
import { Stack, Paper, MenuList, MenuItem, Divider } from "@mui/material";
import { act } from "react-dom/test-utils";

const ChartButtonType = {
    BW: "box-and-whisker",
    SAFE: 'safe-seats',
    BAR: "barchart"
}

export default function ChartBox()
{
    const { mapStore, dataStore } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedChart: '',
        dataReady: false,
        data: {},
        margin: -10
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
        if (!dataStore.isReadyToDisplayCurrentMap()) return boxWhiskerChart;
        if (!dataStore.isEnsemblejsonReady()) return boxWhiskerChart;
        let stateModelData = dataStore.getStateModelData(mapStore.getMapPlan(), mapStore.getState());
        let allGraphData = dataStore.getEnsembleData();
        let safeSeatsData = generateSafeSeatsData(stateModelData.electionDataDict);
        //let winnerSplits = generateWinnerSplitsData(allGraphData.winner_split, allGraphData['enacted_data'].winner_split);
        let bw_data = allGraphData.box_w_data;
        //console.log(winnerSplits);
        if(bw_data) {
            boxWhiskerChart.push(<BoxAndWhiskerChart key={1} data={bw_data} enactedData={allGraphData.enacted_data}/>);
        }
        if(safeSeatsData) {
            boxWhiskerChart.push(<SafeSeats key={2} data={safeSeatsData}/>);
        }
        if(allGraphData) {
            //console.log(winnerSplits);
            boxWhiskerChart.push(<BarChart key={3} winnerData={allGraphData.winner_split} enactedData={allGraphData['enacted_data'].winner_split}/>);
        }
        //console.log(bw_data);
        // for (let id in stateModelData.electionDataDict) {
        //     if (state.incumbentFilter && !stateModelData.electionDataDict[id].hasIncumbent) continue;

        //     boxWhiskerChart.push(<TestChart data={bw_data}} />);
        //     boxWhiskerChart.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]}/>);
        // }
        // setState({
        //     selectedChart: boxWhiskerChart[0]
        // });
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
        console.log(calculated_splits);
        console.log(actual_split);
        let calc = calculated_splits;
        let actual = actual_split;
        if(actual in calc) {
            console.log("here");
            let val = calc[actual];
            console.log(val);
            calc[actual] = [val, 'enacted'];
        }
        else {
            console.log("not in calculated")
            calc[actual] = [1, 'enacted'];
        }
        console.log(calc);
        // if(actual_split in calculated_splits) {
        //     console.log("here");
        //     calculated_splits[actual_split] = [calculated_splits[actual_split], 'enacted'];
        // }
        // else {
        //     calculated_splits[actual_split] = [1, 'enacted'];
        // }
        //calculated_splits[actual_split] = [1, 'enacted'];
        return calc;
    }

    function buildIncumbentList(election_data) {
        let incumbentList = {};
        for (let id in election_data) {
            let district = election_data[id];
            if (district.hasIncumbent) {
                incumbentList[district.districtId] = district.incumbent;
            }  
        }
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

    const handleClick = (event) => {
        let chart = event.target.id;
        if(chart === 'bw') {
            setState({ margin: -10 });
            setState({ selectedChart: boxWhiskerChart[0] });
        }
        else if(chart === 'ensemble') {
            setState({ margin: -7 });
            setState({ selectedChart: boxWhiskerChart[2] });
        }
        else if(chart === 'safeseats') {
            //setState({ margin: -15 });
            setState({ selectedChart: boxWhiskerChart[1] });
        }
        else {
            //do nothing
        }
    }

    return (
        <div>
            {/* <Stack direction="row" spacing={6} marginLeft={state.margin}> */}
            <Stack direction="row" spacing={2}>
                <Paper>
                    <MenuList>
                        <MenuItem id={'bw'} onClick={handleClick}>Box and Whisker</MenuItem>
                        <MenuItem id={'ensemble'} onClick={handleClick}>Ensemble Splits</MenuItem>
                        <MenuItem id={'safeseats'} onClick={handleClick}>Safe Seats</MenuItem>
                    </MenuList>
                </Paper>
                {state.selectedChart}
                {/* {boxWhiskerChart[0]} */}
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
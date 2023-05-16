
import * as React from "react";
import {useContext, useState, useEffect} from "react";
import StoreContext from "../../common/Store";
import BoxAndWhiskerChart from "./BoxAndWhiskerChart";
import BarChart from "./EnsembleSplits";
import SafeSeats from "./SafeSeats";
import Analysis from "./Analysis";
import { Stack, Paper, MenuList, MenuItem, Divider } from "@mui/material";
import { act } from "react-dom/test-utils";


export default function ChartBox()
{
    const { mapStore, dataStore } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedChart: '',
        data: {},
    });
    let boxWhiskerChart = getDistrictSummaryInfo();
    
    function getDistrictSummaryInfo() {
        const boxWhiskerChart = [];
        if (!dataStore.isReadyToDisplayCurrentMap()) return boxWhiskerChart;
        if (!dataStore.isEnsemblejsonReady()) return boxWhiskerChart;
        let stateModelData = dataStore.getStateModelData(mapStore.getMapPlan(), mapStore.getState());
        let allGraphData = dataStore.getEnsembleData();
        let safeSeatsData = generateSafeSeatsData(stateModelData.electionDataDict);
        let bw_data = allGraphData.box_w_data;
        if(bw_data) {
            boxWhiskerChart.push(<BoxAndWhiskerChart key={1} data={bw_data} enactedData={allGraphData.enacted_data}/>);
        }
        if(safeSeatsData) {
            boxWhiskerChart.push(<SafeSeats key={2} data={safeSeatsData}/>);
        }
        if(allGraphData) {
            boxWhiskerChart.push(<BarChart key={3} winnerData={allGraphData.winner_split} enactedData={allGraphData['enacted_data'].winner_split}/>);
        }
        boxWhiskerChart.push(<Analysis/>);
        return boxWhiskerChart;
    }


    function generateSafeSeatsData(election_data) {
        let safe_seats_data = {'incumbent': 0, 'open_seat': 0, 'dem-incmb': 0, 'rep-incmb': 0, 'dem-open': 0, 'rep-open': 0};
        let safe_seats_table = [];
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
                safe_seats_table.push({districtId: district['districtId'], incumbent: true, victoryMargin: district['winVotePercent']});
            } 
            else {
                safe_seats_data['open_seat'] += 1;
                if(district.winnerParty === 'democratic') {
                    safe_seats_data['dem-open'] += 1;
                }
                else {
                    safe_seats_data['rep-open'] += 1;
                }
                safe_seats_table.push({districtId: district['districtId'], incumbent: false, victoryMargin: district['winVotePercent']});
            } 
        }
        return {data: safe_seats_data, table: safe_seats_table};
    }

    const handleClick = (event) => {
        let chart = event.target.id;
        if(chart === 'bw') {
            setState({ selectedChart: boxWhiskerChart[0] });
        }
        else if(chart === 'ensemble') {
            setState({ selectedChart: boxWhiskerChart[2] });
        }
        else if(chart === 'safeseats') {

            setState({ selectedChart: boxWhiskerChart[1] });
        }
        else {
            //do nothing
            setState({ selectedChart: boxWhiskerChart[3] });
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'column', flex:1}}>
            <Stack direction="row" spacing={2} style={{display:'flex', flexDirection:"row", alignItems:'left', justifyContents:'left', flex: "1"}}>
                <Paper>
                    <MenuList>
                        <MenuItem id={'bw'} onClick={handleClick}>Box and Whisker</MenuItem>
                        <MenuItem id={'ensemble'} onClick={handleClick}>Ensemble Splits</MenuItem>
                        <MenuItem id={'safeseats'} onClick={handleClick}>Safe Seats</MenuItem>
                        <MenuItem id={'analysis'} onClick={handleClick}>Analysis</MenuItem>
                    </MenuList>
                </Paper>
                {state.selectedChart}
             </Stack>
        </div>
    );
}
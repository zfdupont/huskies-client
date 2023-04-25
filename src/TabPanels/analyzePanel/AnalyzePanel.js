
import * as React from "react";
import './AnalyzePanel.css'
import Whisker from "./Whisker.tsx";
import {useContext} from "react";
import StoreContext from "../../common/Store";
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";
import SummaryEnsembleTable from "./SummaryEnsembleTable";
import BarChart from "./BarChart";


export default function AnalyzePanel()
{
    const { dataStore } = useContext(StoreContext);

    function getBarchartData() {
        // ONCE ENSEMBLE API CALL IS CREATED, DELETE THE FOLLOWING SECTION
        const barData = dataStore.createBarchartDataByEnsemble();
        return barData;
    }

    return (
        <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 20px)', padding: '10px', display:'flex'}}>
            <div style={{display: "flex", flexDirection: "column", flex:3.5, marginRight: '10px'}}>
                <Paper className="map" style={{flex: 1, marginBottom: '10px'}}>
                    <Whisker></Whisker>
                </Paper>
            </div>
            <div style={{display:'flex', flexDirection:'column', flex:1.7}}>
                <div style={{flex: '0', marginBottom:'10px', height:'100%'}}>
                    <SummaryEnsembleTable></SummaryEnsembleTable>
                </div>
                <Paper style={{display:'flex', flex: '1', height: '90%'}}>
                    <BarChart data={getBarchartData()}></BarChart>
                </Paper>
            </div>
        </div>
    );
}
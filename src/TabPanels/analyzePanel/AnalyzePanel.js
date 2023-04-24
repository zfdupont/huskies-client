
import * as React from "react";
import './AnalyzePanel.css'
import BarChartComponent from "./BarChartComponent";
import Whisker from "./Whisker.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import StoreContext from "../../common/Store";
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";
import SummaryEnsembleTable from "./SummaryEnsembleTable";
import BarChart from "./BarChart";


export default function AnalyzePanel()
{
    const infoTableRef = useRef();
    const { storeMap, storeData } = useContext(StoreContext);
    const [ state, setState ] = useState({
    });

    useEffect(() => {
            console.log("analyze panel...");
    });

    return (
        <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 20px)', padding: '10px', display:'flex'}}>
            <div style={{display: "flex", flexDirection: "column", flex:3.5, marginRight: '10px'}}>
                <Paper className="map" style={{flex: 1, marginBottom: '10px'}}>
                    {/* <MainMap/> */}
                    <Whisker></Whisker>
                </Paper>
                {/* <Paper style={{display:'flex', flexDirection:"column", alignItems:'center', justifyContents:'center', flex: "0 0 300px"}}>
                    {(!storeMap.isStateNone()) && <DistrictCompareTable/>}
                </Paper> */}
            </div>
            <div style={{display:'flex', flexDirection:'column', flex:1.7}}>
                <div style={{flex: '0', marginBottom:'10px', height:'100%'}}>
                    <SummaryEnsembleTable></SummaryEnsembleTable>
                </div>
                <Paper style={{display:'flex', flex: '1', height: '90%'}}>
                    {/* {(!storeMap.isStateNone()) && <DistrictSummaryTable/>} */}
                    <BarChart></BarChart>
                </Paper>
            </div>
        </div>
        // <div id='Panel' style={{backgroundColor: 'white'}}>
        // <Box sx={{position:"relative", height:"100%", marginLeft: '200px'}}>
        //                 <h1>hellooo</h1>
        // </Box>
        //     <Box sx={{position:"relative", height:"100%"}}>
        //     <div className='barChart'>
        //         <BarChartComponent name="Geographic Variation"></BarChartComponent>
        //         <BarChartComponent name="Population Variation" style={{display: 'flex', flexDirection: 'row', left: '500px', bottom: '250px'}}></BarChartComponent>
        //         <BarChartComponent name="Incumbents Winner"></BarChartComponent>
        //         <BarChartComponent name="Number of Democratic Seats"></BarChartComponent>
        //     </div>
        //     </Box>
        //     <Whisker></Whisker>
        // </div>
    );
}
import {useContext} from "react";
import {Paper} from "@mui/material";
import 'leaflet/dist/leaflet.css'

import MainMap from "./MainMap";
import DistrictSummaryTable from "./DistrictSummaryTable";
import StateInfoTable from "./StateInfoTable";
import StoreReducer from '../../common/Store';
import HeatMap from "./HeatMap";
import ChartBox from "../analyzePanel/ChartBox";
import SummaryEnsembleTable from "../analyzePanel/SummaryEnsembleTable";


export default function MapPanel() {
    let { mapStore } = useContext(StoreReducer);

    return (
        <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 20px)', padding: '10px', display:'flex'}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent:'center', flex:3.5, marginRight: '10px'}}>
                <Paper className="map" style={{flex: 1, marginBottom: '10px'}}>
                    <MainMap/>
                    <HeatMap/>
                </Paper>
                <Paper style={{display:'flex', flexDirection:"column", alignItems:'left', justifyContents:'center', flex: "1"}}>
                    {(!mapStore.isStateNone() && (mapStore.getMapPlan() === 'enacted')) && <ChartBox/>}
                </Paper>
            </div>
            <div style={{display:'flex', flexDirection:'column', flex:1.7}}>
                {/*<div style={{flex: '0', marginBottom:'10px', height:'100%'}}>*/}
                {/*  {(!mapStore.isStateNone()) && <StateInfoTable/>}*/}
                {/*</div>*/}
                <div style={{flex: '0', marginBottom:'10px', height:'100%'}}>
                    {(!mapStore.isStateNone() && (mapStore.getMapPlan() === 'enacted')) && <SummaryEnsembleTable/>}
                </div>
                <Paper style={{display:'flex', flex: '1', height: '80%'}}>
                    {(!mapStore.isStateNone()) && <DistrictSummaryTable/>}
                </Paper>
            </div>
        </div>
    );
}
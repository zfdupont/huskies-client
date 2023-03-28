import * as React from "react";
import {useContext} from "react";
import {Paper} from "@mui/material";
import 'leaflet/dist/leaflet.css'

import MainMap from "./MainMap";
import MapSideInfo from "./MapSideInfo";
import MapTopInfo from "./MapTopInfo";
import StoreReducer from '../../common/Store';
import {StateType} from "../../common/Enums";
import MapBottomSlider from "./MapBottomSlider";

export default function MapPanel()
{
    let { storeMap } = useContext(StoreReducer);
    return (
        <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 20px)', padding: '10px', display:'flex'}}>
            <Paper className="map" style={{flex:3.5, marginRight: '10px'}}>
                <MainMap/>
                {(!storeMap.isStateNone()) && <MapTopInfo/>}
                {(!storeMap.isStateNone()) && (storeMap.isSubPlanSelected()) && <MapBottomSlider/>}
            </Paper>
            <div style={{flex:1.5, backgroundColor:'white'}}>
                {(!storeMap.isStateNone()) && <MapSideInfo/>}
            </div>
        </div>
    );
}
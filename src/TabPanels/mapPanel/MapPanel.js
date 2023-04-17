import * as React from "react";
import {useContext} from "react";
import {Paper} from "@mui/material";
import 'leaflet/dist/leaflet.css'

import MainMap from "./MainMap";
import MapSideInfo from "./MapSideInfo";
import MapTopInfo from "./MapTopInfo";
import StoreReducer from '../../common/Store';
import MapBottomSlider from "./MapBottomSlider";
import MapCompareInfo from './MapCompareInfo';


export default function MapPanel()
{
  let { storeMap } = useContext(StoreReducer);
  return (
    <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 20px)', padding: '10px', display:'flex'}}>
      <div style={{display: "flex", flexDirection: "column", flex:3.5, marginRight: '10px'}}>
        <Paper className="map" style={{flex: 1, marginBottom: '10px'}}>
          <MainMap/>
          {(!storeMap.isStateNone()) && <MapTopInfo/>}
          {(!storeMap.isStateNone()) && <MapBottomSlider/>}
        </Paper>
        {
          (!storeMap.isStateNone()) &&
          <Paper style={{display:'flex', flexDirection:"column", alignItems:'center', justifyContents:'center', flex: "0 0 300px"}}>
            <MapCompareInfo key="test"/>
          </Paper>
        }
      </div>
      <Paper style={{flex:1.7, backgroundColor:'white'}}>
        {(!storeMap.isStateNone()) && <MapSideInfo/>}
      </Paper>
    </div>
  );
}
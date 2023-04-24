import DistrictSummaryItem from "./DistrictSummaryItem";
import {Switch} from "@mui/material";
import {useContext, useEffect, useRef, useState} from "react";
import StoreContext from "../../common/Store";
import {PlanType} from "../../common/GlobalVariables";
import * as React from "react";


const TableButtonType = {
    NONE: "none",
    MAIN: "main",
    COMPARE: "compare",
}

export default function DistrictSummaryTable() {
    const infoTableRef = useRef();
    const { mapStore, dataStore } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedTableMenu: TableButtonType.MAIN,
        selectedDistrictId: -1,
        incumbentFilter: true,
    });

    let title = (mapStore.getMapPlan() === PlanType.Y2022)? "2022 District Detail" : "Simulation Detail";
    let titles = getTitles();
    let districtInfo = getDistrictInfo();
    selectedDistrictIdSetup();

    useEffect(() => {
        infoScrollSetup();
    });

    function selectedDistrictIdSetup() {
        if (state.selectedDistrictId !== mapStore.getHighlightDistrictId())
        {
            setState((prev) => ({...prev, selectedDistrictId: mapStore.getHighlightDistrictId()}))
        }
    }

    function getDistrictInfo() {
        const districts = [];
        if (!dataStore.isReadyToDisplayCurrentMap()) return districts;
        let stateModelData = dataStore.getStateModelData(mapStore.getMapPlan(), mapStore.getState());
        for (let id in stateModelData.electionDataDict)
        {
            if (state.incumbentFilter && !stateModelData.electionDataDict[id].hasIncumbent) continue;

            districts.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]}/>);
        }
        return districts;
    }

    function getSimulatedInfo() {
        return []
    }

    function getTitles() {
        if (state.selectedTableMenu !== TableButtonType.COMPARE) return getDistrictInfoTitle();
        else return getCompareInfoTitle();
    }

    function getDistrictInfoTitle() {
        return (
            <div style={{display:'flex', flex: "0 1 50px", marginBottom:'10px'}}>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Districts</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'left', flex: 1.5,  fontSize:'12px', color:'grey'}}>Candidates</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'left', flex: 0,  fontSize:'12px', color:'grey'}}>Incumbent</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Votes</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 0.8,  fontSize:'12px', color:'grey'}}>Percent</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 0.15,  fontSize:'12px', color:'grey'}}></div>
            </div>
        )
    }

    function getCompareInfoTitle() {
        return (
            <div style={{display:'flex', flex: "0 1 50px", marginBottom:'10px'}}>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Districts</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Democrats</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Republican</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>population</div>
            </div>
        )
    }

    function infoScrollSetup() {
        if (mapStore.getHighlightDistrictId() === null) return;
        // const infoItem = infoTableRef?.current?.children[mapStore.getHighlightDistrictId()-1];
        const infoItem = Array.from(infoTableRef?.current?.children).find((item) => {
            return item.getAttribute('value').toString() === mapStore.getHighlightDistrictId().toString()
        });
        if (infoItem) {
            infoItem.scrollIntoView({behavior: "smooth"});
        }
    }

    function onIncumbentFilterClick(event) {
        setState((prevState) => ({...prevState, incumbentFilter: event.target.checked}));
    }

    return (
        <div style={{display: 'flex', flex: '1', flexDirection: "column", height: '100%'}}>
            <div style={{display: 'flex', flexDirection:'column', flex: "0 0 70px", justifyContent: 'center', margineLeft: '20px'}}>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', alignItems:'center', justifyContent: 'left', flex: "1", marginLeft:'20px', fontSize:'18px', fontWeight:'500'}}>
                        {title}
                    </div>
                    <div style={{display:'flex', alignItems:'center', justifyContent: 'right', flex:'1', fontSize:'12px'}}>
                        Only Incumbents
                        <Switch aria-label='Switch demo' size="small" sx={{margin: 1}} checked={state.incumbentFilter} onClick={onIncumbentFilterClick} />
                    </div>
                </div>
            </div>
            <div style={{justifyContent: 'left'}}>
                {titles}
            </div>
            <div style={{flex:'0 0 1px', backgroundColor:'#cbcbcb'}}/>
            <div ref={infoTableRef} style={{display:'flex', flexDirection:'column', flex:'1', overflow: 'auto', minHeight: 0}}>
                {districtInfo}
            </div>
        </div>
    );
}
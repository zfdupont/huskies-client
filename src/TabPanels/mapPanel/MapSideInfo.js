import MapSideItem from "./MapSideItem";
import {Paper, Switch} from "@mui/material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useContext, useEffect, useRef, useState} from "react";
import StoreContext from "../../common/Store";
import {FilterType, PlanType} from "../../common/Enums";
import * as React from "react";

const ButtonToggle = {
    true: "outlined",
    false: "contained",
};

const TableButtonType = {
    NONE: "none",
    MAIN: "main",
    COMPARE: "compare",
}

export default function MapSideInfo()
{
    const infoTableRef = useRef();
    const { storeMap, storeData } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedTableMenu: TableButtonType.MAIN,
        selectedDistrictId: -1,
        incumbentFilter: true,
    });

    let tableMenu = getTableMenu();
    let title = (storeMap.getMapPlan() === PlanType.Y2022)? "2022 District Detail" : "Simulation Detail";
    let titles = getTitles();
    let districtInfo = getDistrictInfo();
    selectedDistrictIdSetup();

    useEffect(() => {
        infoScrollSetup();
    });

    function selectedDistrictIdSetup()
    {
        if (state.selectedDistrictId !== storeMap.getHighlightDistrictId())
        {
            setState((prev) => ({...prev, selectedDistrictId: storeMap.getHighlightDistrictId()}))
        }
    }

    function getDistrictInfo()
    {
        const districts = [];
        if (!storeData.isReadyToDisplayCurrentMap()) return districts;
        let stateModelData = storeData.getStateModelData(storeMap.getMapPlan(), storeMap.getState());
        for (let id in stateModelData.electionDataDict)
        {
            if (state.incumbentFilter && !stateModelData.electionDataDict[id].hasIncumbent) continue;

            districts.push(<MapSideItem key={id} electionData={stateModelData.electionDataDict[id]}/>);
        }
        return districts;
    }

    function getSimulatedInfo()
    {
        return []
    }
    function getTitles()
    {
        if (state.selectedTableMenu !== TableButtonType.COMPARE) return getDistrictInfoTitle();
        else return getCompareInfoTitle();
    }

    function getDistrictInfoTitle()
    {
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

    function getCompareInfoTitle()
    {
        return (
            <div style={{display:'flex', flex: "0 1 50px", marginBottom:'10px'}}>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Districts</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Democrats</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Republican</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>population</div>
            </div>
        )
    }

    function getTableMenu()
    {
        const buttons = [
            <Button key="1" variant={ButtonToggle[state.selectedTableMenu === TableButtonType.MAIN]}
                    onClick={() => onTableMenuClicked(TableButtonType.MAIN)}>{storeMap.getMapPlan()}
            </Button>,
            storeMap.getMapPlan() !== storeData.getPlanType().Y2020 && <Button key="2" variant={ButtonToggle[state.selectedTableMenu === TableButtonType.COMPARE]}
                     onClick={() => onTableMenuClicked(TableButtonType.COMPARE)}>Simulation
            </Button>,
        ];

        return(
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'right',
                    '& > *': {
                        m: 1,
                    },
                }}
            >
                <ButtonGroup size="small" aria-label="small button group">
                    {buttons}
                </ButtonGroup>
            </Box>)
    }
    let onTableMenuClicked = (tableButtonType) => {
        setState({selectedTableMenu: tableButtonType});
    }

    function infoScrollSetup()
    {
        if (storeMap.getHighlightDistrictId() === -1) return;
        // const infoItem = infoTableRef?.current?.children[storeMap.getHighlightDistrictId()-1];
        const infoItem = Array.from(infoTableRef?.current?.children).find((item) => {
            return item.getAttribute('value').toString() === storeMap.getHighlightDistrictId().toString()
        });
        if (infoItem)
        {
            infoItem.scrollIntoView({behavior: "smooth"});
        }
    }

    function onIncumbentFilterClick(event)
    {
        setState((prevState) => ({...prevState, incumbentFilter: event.target.checked}));
    }

    return (
        <Paper style={{display: 'flex', flexFlow: "column", position:'relative', width:'100%', height:'100%'}}>
            <div style={{display: 'flex', flex: "0 0 70px", justifyContent: 'center', margineLeft: '20px'}}>
                <div style={{display: 'flex', alignItems:'center', justifyContent: 'left', flex: "1", marginLeft:'20px', fontSize:'18px', fontWeight:'500'}}>
                    {/*{tableMenu}*/}
                    {title}
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent: 'right', flex:'1', fontSize:'12px'}}>
                    Only Incumbents
                    <Switch aria-label='Switch demo' size="small" sx={{margin: 1}} checked={state.incumbentFilter} onClick={onIncumbentFilterClick} />
                </div>
            </div>
            <div style={{flex: "0", justifyContent: 'left'}}>
                {titles}
            </div>
            <div style={{flex:'0 0 1px', backgroundColor:'#cbcbcb'}}/>
            <div ref={infoTableRef} style={{position:'relative', display:'flex', flexFlow: 'column', flex: '1 1 auto', backgroundColor:'white', overflowY: 'scroll'}}>
                {districtInfo}
            </div>
        </Paper>
    );
}
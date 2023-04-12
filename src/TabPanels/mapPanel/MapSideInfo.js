import MapSideItem from "./MapSideItem";
import {Paper} from "@mui/material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useContext, useEffect, useRef, useState} from "react";
import StoreContext from "../../common/Store";
import MapSideCompareItem from "./MapSideCompareItem";
import MapSideCompareInfo from './MapSideCompareInfo';
import {PlanType} from "../../common/Enums";

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
    });

    let tableMenu = getTableMenu();
    let titles = getTitles();
    let districtInfo = getDistrictInfo();
    let compareInfo = getCompareInfo();
    selectedDistrictIdSetup();

    useEffect(() => {
        infoScrollSetup();
    });

    function selectedDistrictIdSetup()
    {
        if (state.selectedDistrictId !== storeMap.getHighlightDistrictId())
        {
            setState(() => {
                return {
                    selectedTableMenu: state.selectedTableMenu,
                    selectedDistrictId: storeMap.getHighlightDistrictId(),
                }
            })
        }
    }


    function getDistrictInfo()
    {
        const districts = [];
        if (!storeData.isReadyToDisplayCurrentMap()) return districts;
        let stateModelData = storeData.getStateModelData(storeMap.getMapPlan(), storeMap.getState());
        for (let id in stateModelData.districts)
        {
            districts.push(<MapSideItem key={id} districtModelData={stateModelData.districts[id]}/>);
        }
        return districts;
    }
    function getCompareInfo()
    {
        const compares = [];
        if (!storeData.isReadyToDisplayCurrentMap()) return compares;
        let modelData = storeData.getStateModelData(storeMap.getMapPlan(), storeMap.getState());
        let modelData2020 = storeData.getStateModelData(PlanType.Y2020, storeMap.getState());
        for (let id in modelData.districts)
        {
            compares.push(<MapSideCompareItem key={id} model={modelData.districts[id]} model2020={modelData2020.districts[id]}/>);
        }
        return compares;
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
                <div style={{display:'flex', alignItems: 'end', justifyContent:'left', flex: 0,  fontSize:'12px', color:'grey'}}>Inc.</div>
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
                     onClick={() => onTableMenuClicked(TableButtonType.COMPARE)}>Compare to 2020
            </Button>,
        ];

        return(
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
        const infoItem = infoTableRef?.current?.children[storeMap.getHighlightDistrictId()-1];
        if (infoItem)
        {
            infoItem.scrollIntoView({behavior: "smooth"});
        }
    }


    return (
        <Paper style={{display: 'flex', flexFlow: "column", position:'relative', width:'100%', height:'100%'}}>
            <div style={{display: 'flex', flex: "0", justifyContent: 'center'}}>
                {tableMenu}
            </div>
            <div style={{flex: "0", justifyContent: 'left'}}>
                {titles}
            </div>
            <div ref={infoTableRef} style={{position:'relative', display:'flex', flexFlow: 'column', flex: '1 1 auto', backgroundColor:'white', overflowY: 'scroll'}}>
                {districtInfo}
            </div>

            {/*{(state.selectedTableMenu === TableButtonType.COMPARE) &&*/}
            {/*<div style={{position:'relative', flex: '1 1 auto', backgroundColor:'white'}}>*/}
            {/*    <MapSideCompareInfo/>*/}
            {/*</div>}*/}
        </Paper>
    );
}
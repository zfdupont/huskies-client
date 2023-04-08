import MapSideItem from "./MapSideItem";
import {Paper} from "@mui/material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useContext, useEffect, useState} from "react";
import StoreContext from "../../common/Store";
import MapSideCompareItem from "./MapSideCompareItem";

const ButtonToggle = {
    true: "outlined",
    false: "contained",
};

const TableButtonType = {
    NONE: "none",
    PREVIOUS: "previous",
    AFTER: "after",
    COMPARE: "compare",
}

export default function SideTest()
{
    const { storeMap, storeData } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedTableMenu: TableButtonType.NONE,
    });

    let compareText = (state.selectedTableMenu === TableButtonType.COMPARE)? `${storeMap.getMapSubPlan()}->${storeMap.getMapPlan()}` : "Compare";
    let tableMenu = getTableMenu();
    let titles = getTitles();
    let districtInfo = getDistrictInfo();
    let compareInfo = getCompareInfo();
    let currentInfo = (state.selectedTableMenu === TableButtonType.COMPARE)? compareInfo : districtInfo;
    function getDistrictInfo()
    {
        const districts = [];
        if (state.selectedTableMenu === TableButtonType.COMPARE || !storeData.isReadyToDisplayCurrentMap()) return districts;
        const planType = getPlanTypeByButtonType(state.selectedTableMenu);
        let stateModelData = storeData.getStateModelData(planType, storeMap.getState());
        for (let id in stateModelData.districts)
        {
            districts.push(<MapSideItem key={id} districtModelData={stateModelData.districts[id]}/>);
        }
        return districts;
    }
    function getCompareInfo()
    {
        const compares = [];
        if (!storeMap.isSubPlanSelected() || !storeData.isReadyToDisplayCurrentMap()) return compares;
        let stateModelData1 = storeData.getStateModelData(storeMap.getMapPlan(), storeMap.getState());
        let stateModelData2 = storeData.getStateModelData(storeMap.getMapSubPlan(), storeMap.getState());
        for (let id in stateModelData1.districts)
        {
            compares.push(<MapSideCompareItem key={id} modelA={stateModelData1.districts[id]} modelB={stateModelData2.districts[id]}/>);
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
        if (storeMap.isSubPlanSelected()) {
            if (state.selectedTableMenu === TableButtonType.NONE)
                setState({selectedTableMenu: TableButtonType.PREVIOUS});

            const buttons = [
                <Button variant={ButtonToggle[TableButtonType.PREVIOUS === state.selectedTableMenu]}
                        onClick={() => onTableMenuClicked(TableButtonType.PREVIOUS)}>{storeMap.getMapPlan()}</Button>,
                <Button variant={ButtonToggle[TableButtonType.AFTER === state.selectedTableMenu]}
                        onClick={() => onTableMenuClicked(TableButtonType.AFTER)}>{storeMap.getMapSubPlan()}</Button>,
                <Button variant={ButtonToggle[TableButtonType.COMPARE === state.selectedTableMenu]}
                        onClick={() => onTableMenuClicked(TableButtonType.COMPARE)}>{compareText}</Button>,
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
    }
    function getPlanTypeByButtonType(tableButtonType)
    {
        if (!storeMap.isSubPlanSelected()) return storeMap.getMapPlan();
        if (tableButtonType === TableButtonType.NONE) return storeMap.getMapPlan();
        if (tableButtonType === TableButtonType.PREVIOUS) return storeMap.getMapSubPlan();
        if (tableButtonType === TableButtonType.AFTER) return storeMap.getMapPlan();
    }

    let onTableMenuClicked = (tableButtonType) => {
        setState({selectedTableMenu: tableButtonType});
    }

    return (
        <Paper style={{display: 'flex', flexFlow: "column", position:'relative', width:'100%', height:'100%'}}>
            <div style={{display:'flex', flex: "0", justifyContent: 'center'}}>
                {storeMap.isSubPlanSelected() && tableMenu}
            </div>
            <div style={{flex: "0", justifyContent: 'left'}}>
                {titles}
            </div>
            <div style={{position:'relative', display:'flex', flexFlow: 'column', flex: '1 1 auto', backgroundColor:'white', overflowY: 'scroll'}}>
                {currentInfo}
            </div>
        </Paper>
    );
}
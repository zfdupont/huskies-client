import MapSideItem from "./MapSideItem";
import {Paper} from "@mui/material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useContext, useEffect, useState} from "react";
import StoreContext from "../../common/Store";

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
    const { storeMap } = useContext(StoreContext);
    const [ state, setState ] = useState({
        selectedTableMenu: TableButtonType.NONE,
    });
    useEffect(() => {
        if (storeMap.isSubPlanSelected())
        {
            onTableMenuClicked(TableButtonType.PREVIOUS);
        }
    }, [])

    const districts = []; 
    for(let i = 1; i <= 27; ++i){
        districts.push(<MapSideItem key={i} id={i}/>)
    }

    let tableMenu = null;
    if (storeMap.isSubPlanSelected())
    {
        const buttons = [
            <Button variant={ButtonToggle[TableButtonType.PREVIOUS === state.selectedTableMenu]} onClick={() => onTableMenuClicked(TableButtonType.PREVIOUS)}>{storeMap.getMapPlan()}</Button>,
            <Button variant={ButtonToggle[TableButtonType.AFTER === state.selectedTableMenu]} onClick={() => onTableMenuClicked(TableButtonType.AFTER)}>{storeMap.getMapSubPlan()}</Button>,
            <Button variant={ButtonToggle[TableButtonType.COMPARE === state.selectedTableMenu]} onClick={() => onTableMenuClicked(TableButtonType.COMPARE)}>Compare</Button>,
        ];

        tableMenu =
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
        </Box>
    }

    let onTableMenuClicked = (tableButtonType) => {
        setState({selectedTableMenu: tableButtonType});
    }

    return (
        <Paper style={{display: 'flex', flexFlow: "column", position:'relative', width:'100%', height:'100%'}}>
            <div style={{display:'flex', flex: "0", justifyContent: 'center'}}>
                {storeMap.isSubPlanSelected() && tableMenu}
            </div>
            <div style={{display:'flex', flex: "0 1 50px", marginBottom:'10px'}}>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Districts</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'left', flex: 1.5,  fontSize:'12px', color:'grey'}}>Candidates</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'left', flex: 0,  fontSize:'12px', color:'grey'}}>Inc.</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Votes</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 0.8,  fontSize:'12px', color:'grey'}}>Percent</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 0.15,  fontSize:'12px', color:'grey'}}></div>
            </div>
            <div style={{position:'relative', display:'flex', flexFlow: 'column', flex: '1 1 auto', backgroundColor:'white', overflowY: 'scroll'}}>
                {districts}
            </div>
        </Paper>
    );
}
import * as React from 'react';
import {useContext, useEffect} from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Star from '@mui/icons-material/Star';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import StoreContext from './Store';
import {PlanType} from "./Enums";

export default function NestedList() {
    const { storeMap } = useContext(StoreContext);
    const [open, setOpen] = React.useState(true);

    useEffect(() => {
        // Select 2022 plan by default.
        onPlanButtonClick(PlanType.Y2022);
    }, [])

    const handleClick = () => {
        setOpen(!open);
    };

    let listTitle = (open)? "Plan" : getListTitle();
    let planButtons = [];
    for (const planKey in PlanType)
    {
        let planType = PlanType[planKey];
        planButtons.push(
            <ListItemButton key={planType} selected={isPlanSelected(planType)} sx={{ pl: 6 }} onClick={() => onPlanButtonClick(planType)}>
                <ListItemText primary={planType} primaryTypographyProps={{fontSize: "12px"}}  />
                {(storeMap.getMapPlan() === planType) && <LooksOneOutlinedIcon color="primary" />}
                {(storeMap.getMapSubPlan() === planType) && <LooksTwoOutlinedIcon color="success" />}
            </ListItemButton>
        )
    }

    function getListTitle()
    {
        if (storeMap.isSubPlanSelected()) return `${storeMap.getMapPlan()} | ${storeMap.getMapSubPlan()}`;
        return storeMap.getMapPlan();
    }

    function isPlanSelected(planType){
        return (storeMap.getMapPlan() === planType || storeMap.getMapSubPlan() === planType)
    }

    function onPlanButtonClick(planType){
        // Unselect plan.
        if (storeMap.getMapPlan() === planType) {storeMap.unselectPlan(); return;}
        // None of the plan is selected.
        if (storeMap.getMapPlan() === null) {storeMap.selectPlan(planType); return;}
        // Unselect sub plan.
        if (storeMap.getMapSubPlan() === planType) {storeMap.unselectSubPlan(); return;}
        // Select sub plan.
        storeMap.selectSubPlan(planType);
    }

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={handleClick} sx={{ pl: 2 }}>
                <ListItemIcon>
                    <Star />
                </ListItemIcon>
                <ListItemText style={{position:"absolute", left:'48px'}}  primary={listTitle} primaryTypographyProps={{fontSize: "14px"}} />
                {open ? <ExpandLess style={{position:"absolute", left:'160px'}} /> : <ExpandMore style={{position:"absolute", left:'160px'}} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {planButtons}
                </List>
            </Collapse>
        </List>
    );
}

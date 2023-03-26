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
import StoreContext from './Store';
import {PlanType} from "./Enums";

export default function NestedList() {
    const { store } = useContext(StoreContext);
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
        planButtons.push
            // eslint-disable-next-line no-loop-func
        (<ListItemButton key={planType} selected={isPlanSelected(planType)} sx={{ pl: 6 }} onClick={() => onPlanButtonClick(planType)}>
            <ListItemText primary={planType} primaryTypographyProps={{fontSize: "12px"}}  />
        </ListItemButton>)
    }

    function getListTitle()
    {
        if (store.isSubPlanSelected()) return `${store.getMapPlan()} | ${store.getMapSubPlan()}`;
        return store.getMapPlan();
    }

    function isPlanSelected(planType){
        return (store.getMapPlan() === planType || store.getMapSubPlan() === planType)
    }

    function onPlanButtonClick(planType){
        // Unselect plan.
        if (store.getMapPlan() === planType) {store.unselectPlan(); return;}
        // None of the plan is selected.
        if (store.getMapPlan() === null) {store.selectPlan(planType); return;}
        // Unselect sub plan.
        if (store.getMapSubPlan() === planType) {store.unselectSubPlan(); return;}
        // Select sub plan.
        store.selectSubPlan(planType);
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

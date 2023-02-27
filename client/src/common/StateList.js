import * as React from 'react';
import { useContext, useEffect } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Star from '@mui/icons-material/Star';

import StoreContext from './Store';
import {StateType} from './Store';

export default function NestedList() {
    const { store } = useContext(StoreContext);
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    //Test
    function onStateClick(stateType)
    {
        (store.isStateMatch(stateType))? store.unselectState() : store.selectState(stateType);
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
                <ListItemText style={{position:"absolute", left:'48px'}} primary="States" primaryTypographyProps={{fontSize: store.sx.drawerList.mainFontSize}} />
                {open ? <ExpandLess style={{position:"absolute", left:'160px'}} /> : <ExpandMore style={{position:"absolute", left:'160px'}} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton  selected={store.isStateMatch(StateType.NEWYORK)} onClick={(e) => {onStateClick(StateType.NEWYORK)}} sx={{ pl: 6 }}>
                        <ListItemText primary="New York" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}  />
                    </ListItemButton>
                    <ListItemButton  selected={store.isStateMatch(StateType.GEORGIA)} onClick={() => {onStateClick(StateType.GEORGIA)}} sx={{ pl: 6 }}>
                        <ListItemText primary="Georgia" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}} />
                    </ListItemButton>
                    <ListItemButton  selected={store.isStateMatch(StateType.ILLINOIS)} onClick={() => {onStateClick(StateType.ILLINOIS)}} sx={{ pl: 6 }}>
                        <ListItemText primary="Illinois" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}} />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}

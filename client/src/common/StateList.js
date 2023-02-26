import * as React from 'react';
import { useContext, useEffect } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

import StoreContext from './Store';
import {StateType} from './Store';

export default function NestedList() {
    const { store } = useContext(StoreContext);
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    function onStateClick(stateType)
    {
        store.selectState(stateType);
    }
    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={handleClick} sx={{ pl: 2 }}>
                <ListItemText primary="States" primaryTypographyProps={{fontSize: store.sx.drawerList.mainFontSize}} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton onClick={() => {onStateClick(StateType.NEWYORK)}} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="New York" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}  />
                    </ListItemButton>
                    <ListItemButton onClick={() => {onStateClick(StateType.GEORGIA)}} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Georgia" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}} />
                    </ListItemButton>
                    <ListItemButton onClick={() => {onStateClick(StateType.ILLINOIS)}} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Illinois" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}} />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}

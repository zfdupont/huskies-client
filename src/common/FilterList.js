// React
import * as React from 'react';
import {useCallback, useContext, useEffect, useState} from "react";
// MUI
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Star from '@mui/icons-material/Star';
import {ListItem, Switch} from "@mui/material";
// source
import StoreContext from "./Store";
import {FilterType, StateType} from './Enums';

export default function NestedList() {
    const { storeMap, callbacks }= useContext(StoreContext);
    const [open, setOpen] = useState(true);
    const [switches, setSwitches] = useState({
        [FilterType.DEMOCRAT]: false,
        [FilterType.REPUBLICAN]: false,
        [FilterType.INCUMBENT]: false,
    })
    const resetStateFilter = useCallback(() => {
        resetFilters();
    }, [])

    useEffect(() => {
        callbacks.addOnResetState(resetStateFilter);
    }, [])

    const label = {inputProps: { 'aria-label': 'Switch demo' }};
    const onListClick = () => {
        setOpen(!open);
    };

    const onToggle = (e, filterType) => {
        (e.target.checked)? storeMap.addFilter(filterType) : storeMap.removeFilter(filterType)
        setSwitches({
            ...switches,
            [filterType]: e.target.checked,
        })
    };

    function resetFilters()
    {
        setSwitches({
            [FilterType.DEMOCRAT]: false,
            [FilterType.REPUBLICAN]: false,
            [FilterType.INCUMBENT]: false,
        })
    }

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={onListClick} sx={{ pl: 2}}>
                <ListItemIcon>
                    <Star />
                </ListItemIcon>
                <ListItemText style={{position:"absolute", left:'48px'}} primary="Filter" primaryTypographyProps={{fontSize: '14px'}} />
                {open ? <ExpandLess style={{position:"absolute", left:'160px'}} /> : <ExpandMore style={{position:"absolute", left:'160px'}} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Democrat" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.DEMOCRAT]} size="small" color="warning" onClick={(e) => {onToggle(e, FilterType.DEMOCRAT)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Republican" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.REPUBLICAN]} size="small" onClick={(e) => {onToggle(e, FilterType.REPUBLICAN)}} />
                    </ListItem>
                    <ListItem sx={{ pl:6 }}>
                        <ListItemText primary="Incumbent" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.INCUMBENT]} size="small" onClick={(e) => {onToggle(e, FilterType.INCUMBENT)}} />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    );
}

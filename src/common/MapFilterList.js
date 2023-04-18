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

export default function MapFilterList() {
    const { storeMap, callbacks }= useContext(StoreContext);
    const [open, setOpen] = useState(true);
    const [switches, setSwitches] = useState({
        [FilterType.INCUMBENT]: false,
        [FilterType.PARTY]: false,
        [FilterType.WHITE]: false,
        [FilterType.BLACK]: false,
        [FilterType.ASIAN]: false,
    })
    const resetStateFilter = useCallback(() => {
        resetFilters();
    }, [])

    useEffect(() => {
        callbacks.addOnResetState(resetStateFilter);
    }, [])

    const label = {inputProps: { 'aria-label': 'Switch demo' }};

    const menuTitle = "Map Filter";

    const onListClick = () => {
        setOpen(!open);
    };

    const onToggle = (e, filterType) => {

        let state;
        if (filterType === FilterType.INCUMBENT)
        {
            state = {...switches, [FilterType.INCUMBENT]: e.target.checked};
            storeMap.setIncumbentFilter(e.target.checked);
        }
        else
        {
            state = {
                [FilterType.INCUMBENT]: switches[FilterType.INCUMBENT],
                [FilterType.PARTY]: false,
                [FilterType.WHITE]: false,
                [FilterType.BLACK]: false,
                [FilterType.ASIAN]: false,
            }
            state[filterType] = e.target.checked;
            storeMap.setColorFilter(filterType);
        }

        setSwitches(state);
    };

    function resetFilters()
    {
        setSwitches({
            [FilterType.INCUMBENT]: false,
            [FilterType.PARTY]: false,
            [FilterType.WHITE]: false,
            [FilterType.BLACK]: false,
            [FilterType.ASIAN]: false,
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
                <ListItemText style={{position:"absolute", left:'48px'}} primary={menuTitle} primaryTypographyProps={{fontSize: '14px'}} />
                {open ? <ExpandLess style={{position:"absolute", left:'160px'}} /> : <ExpandMore style={{position:"absolute", left:'160px'}} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl:6 }}>
                        <ListItemText primary="Incumbent" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.INCUMBENT]} size="small" onClick={(e) => {onToggle(e, FilterType.INCUMBENT)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Party" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.PARTY]} size="small" color="warning" onClick={(e) => {onToggle(e, FilterType.PARTY)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="White" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.WHITE]} size="small" onClick={(e) => {onToggle(e, FilterType.WHITE)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Black" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.BLACK]} size="small" onClick={(e) => {onToggle(e, FilterType.BLACK)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Asian" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[FilterType.ASIAN]} size="small" onClick={(e) => {onToggle(e, FilterType.ASIAN)}} />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    );
}

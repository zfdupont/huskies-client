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
import {MapFilterType, StateType} from './GlobalVariables';

export default function MapFilterList() {
    const { mapStore, callbacks }= useContext(StoreContext);
    const [open, setOpen] = useState(true);
    const [switches, setSwitches] = useState({
        [MapFilterType.INCUMBENT]: false,
        [MapFilterType.VICTORYMARGIN]: true,
        [MapFilterType.WHITE]: false,
        [MapFilterType.BLACK]: false,
        [MapFilterType.HISPANIC]: false,
    })
    const resetStateFilter = useCallback(() => {
        resetFilters();
    }, [])

    useEffect(() => {
        callbacks.addOnResetState(resetStateFilter);
    }, [])

    useEffect(() => {
        mapStore.setColorFilter(MapFilterType.VICTORYMARGIN)
    }, [])

    const label = {inputProps: { 'aria-label': 'Switch demo' }};
    const menuTitle = "Map Filter";

    const onListClick = () => {
        setOpen(!open);
    };

    const onToggle = (e, filterType) => {
        let state;
        if (filterType === MapFilterType.INCUMBENT) {
            state = {...switches, [MapFilterType.INCUMBENT]: e.target.checked};
            mapStore.setIncumbentFilter(e.target.checked);
        }
        else {
            state = {
                [MapFilterType.INCUMBENT]: switches[MapFilterType.INCUMBENT],
                [MapFilterType.VICTORYMARGIN]: true,
                [MapFilterType.WHITE]: false,
                [MapFilterType.BLACK]: false,
                [MapFilterType.HISPANIC]: false,
            }
            state[filterType] = e.target.checked;
            filterType = (e.target.checked)? filterType : MapFilterType.NONE;
            mapStore.setColorFilter(filterType);
        }
        setSwitches(state);
    };

    function resetFilters() {
        setSwitches({
            [MapFilterType.INCUMBENT]: false,
            [MapFilterType.VICTORYMARGIN]: false,
            [MapFilterType.WHITE]: false,
            [MapFilterType.BLACK]: false,
            [MapFilterType.HISPANIC]: false,
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
                        <Switch {...label} checked={switches[MapFilterType.INCUMBENT]} size="small" onClick={(e) => {onToggle(e, MapFilterType.INCUMBENT)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Victory Margin" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[MapFilterType.VICTORYMARGIN]} size="small"  onClick={(e) => {onToggle(e, MapFilterType.VICTORYMARGIN)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="White Pop" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[MapFilterType.WHITE]} size="small" onClick={(e) => {onToggle(e, MapFilterType.WHITE)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Black Pop" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[MapFilterType.BLACK]} size="small" onClick={(e) => {onToggle(e, MapFilterType.BLACK)}} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Hispanic Pop" primaryTypographyProps={{fontSize: '12px'}} />
                        <Switch {...label} checked={switches[MapFilterType.HISPANIC]} size="small" onClick={(e) => {onToggle(e, MapFilterType.HISPANIC)}} />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    );
}

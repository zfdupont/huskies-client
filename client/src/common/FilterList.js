import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Star from '@mui/icons-material/Star';
import {useContext} from "react";
import StoreContext from "./Store";
import {ListItem, Switch} from "@mui/material";

export default function NestedList() {
    const { store } = useContext(StoreContext);
    const [open, setOpen] = React.useState(true);
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            // subheader={
            //     <ListSubheader component="div" id="nested-list-subheader">
            //         Temp header text
            //     </ListSubheader>
            // }
        >
            <ListItemButton onClick={handleClick} sx={{ pl: 2}}>
                <ListItemIcon>
                    <Star />
                </ListItemIcon>
                <ListItemText style={{position:"absolute", left:'48px'}} primary="Filter" primaryTypographyProps={{fontSize: store.sx.drawerList.mainFontSize}} />
                {open ? <ExpandLess style={{position:"absolute", left:'160px'}} /> : <ExpandMore style={{position:"absolute", left:'160px'}} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Democrat" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                        <Switch {...label} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Republican" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                        <Switch {...label} />
                    </ListItem>
                    <ListItem sx={{ pl:6 }}>
                        <ListItemText primary="Incumbent" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                        <Switch {...label} />
                    </ListItem>
                    <ListItem sx={{ pl: 6 }}>
                        <ListItemText primary="Differences" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                        <Switch {...label} />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    );
}

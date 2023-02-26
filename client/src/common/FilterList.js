import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import {useContext} from "react";
import StoreContext from "./Store";

export default function NestedList() {
    const { store } = useContext(StoreContext);
    const [open, setOpen] = React.useState(true);

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
            <ListItemButton onClick={handleClick} sx={{ pl: 2 }}>
                <ListItemText primary="Filter" primaryTypographyProps={{fontSize: store.sx.drawerList.mainFontSize}} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Democrat" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Republican" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="New Constitute" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Incumbent" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}/>
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}

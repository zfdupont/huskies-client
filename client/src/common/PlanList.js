import * as React from 'react';
import { useContext } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import StoreContext from './Store';

export default function NestedList() {
    const { store } = useContext(StoreContext);
    const [open, setOpen] = React.useState(true);


    const handleClick = () => {
        setOpen(!open);
    };

    let ListTitle = (open)? "Plan" : store.getMapPlan();

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={handleClick} sx={{ pl: 2 }}>
                <ListItemText primary={ListTitle} primaryTypographyProps={{fontSize: store.sx.drawerList.mainFontSize}} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton selected={true} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="2022" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}  />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="2020" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}  />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="#1423" primaryTypographyProps={{fontSize: store.sx.drawerList.subFontSize}}  />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}

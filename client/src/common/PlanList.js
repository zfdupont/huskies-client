import * as React from 'react';
import { useContext } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Star from '@mui/icons-material/Star';
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
                <ListItemIcon>
                    <Star />
                </ListItemIcon>
                <ListItemText style={{position:"absolute", left:'48px'}}  primary={ListTitle} primaryTypographyProps={{fontSize: "14px"}} />
                {open ? <ExpandLess style={{position:"absolute", left:'160px'}} /> : <ExpandMore style={{position:"absolute", left:'160px'}} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton selected={true} sx={{ pl: 6 }}>
                        <ListItemText primary="2022" primaryTypographyProps={{fontSize: "12px"}}  />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 6 }}>
                        <ListItemText primary="2020" primaryTypographyProps={{fontSize: "12px"}}  />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 6 }}>
                        <ListItemText primary="#1423" primaryTypographyProps={{fontSize: "12px"}}  />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}

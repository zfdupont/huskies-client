import * as React from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
// MUI
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
// Custom
import DrawerLists from "./DrawerLists";
import Reset from "../TabPanels/mapPanel/Reset";
import StoreContext from './Store';
import {TabType} from "./Enums";

const drawerWidth = 200;

function ResponsiveDrawer(props) {
    const { storePage } = useContext(StoreContext);

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <DrawerLists/>
            <Divider />
            {storePage.isTabMatch(TabType.MAP) && <Reset/>}
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;

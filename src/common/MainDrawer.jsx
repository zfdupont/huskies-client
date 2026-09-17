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
import ResetButtonGroup from "../TabPanels/mapPanel/ResetButtonGroup";
import StoreContext from './Store';
import {TabType} from "./GlobalVariables";
import useIsMobile from '../hooks/use-is-mobile.hook';

const drawerWidth = 200;

function ResponsiveDrawer(props) {
    const { pageStore } = useContext(StoreContext);
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(!isMobile);
    const [height, setHeight] = React.useState(0);
    const ref = React.useRef(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
    }

    React.useEffect(() => {
        setHeight(ref.current.clientHeight)
    }, []);

    const drawer = (
        <div>
            <Toolbar ref={ref}/>
            <Divider />
            <DrawerLists/>
            <Divider />
            {pageStore.isTabMatch(TabType.MAP) && <ResetButtonGroup/>}
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >

                <div className='navbar'
                style={{
                    position:'absolute',
                    backgroundColor: 'white',
                    width:`100vw`,
                    zIndex: 10000,
                    top: '0px',
                    left:'0px',
                }}
                >
                    <div 
                    className='logo'
                    style={{     
                        backgroundImage: `url(${process.env.PUBLIC_URL + '/Huskies3.png'})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'left',
                        width: `${drawerWidth-1}px`,
                        height:`${height}px`,    
                    }}
                    onClick={() => handleDrawerToggle()}
                    >
                    </div>
                </div>
                

                <Drawer
                    variant="persistent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                        zIndex:0,

                    }}
                    open={open}
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

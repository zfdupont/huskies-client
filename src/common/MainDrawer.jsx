import * as React from 'react';
import PropTypes from 'prop-types';
// MUI
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
// Custom
import DrawerLists from "./DrawerLists";
import ResetButtonGroup from "../TabPanels/mapPanel/ResetButtonGroup";
import useIsMobile from '../hooks/use-is-mobile.hook';

const drawerWidth = 200;

function ResponsiveDrawer(props) {
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(!isMobile);
    // Default to the standard toolbar height so the logo (the mobile drawer
    // toggle) stays tappable even when the drawer's Toolbar hasn't mounted yet
    // (temporary drawer starts closed on mobile).
    const [height, setHeight] = React.useState(64);
    const ref = React.useRef(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
    }

    React.useEffect(() => {
        if (ref.current) setHeight(ref.current.clientHeight);
    }, [open]);

    const drawer = (
        <div>
            <Toolbar ref={ref}/>
            <Divider />
            <DrawerLists/>
            <Divider />
            <ResetButtonGroup/>
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
                    position:'fixed',
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
                    variant={isMobile ? 'temporary' : 'persistent'}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                        // On mobile the temporary drawer must sit above the fixed
                        // navbar (zIndex 10000) so its scrim and paper are visible.
                        zIndex: isMobile ? 13000 : 0,
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

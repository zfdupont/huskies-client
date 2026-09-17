import Box from "@mui/material/Box";
import MainTab from "./MainTabPanel";
import MainDrawer from "./MainDrawer";
import * as React from "react";

import Loader from "./Loader";

import StoreContext from "./Store";


export default function HomePage() {
    const {loading} = React.useContext(StoreContext)
    return (
        <Box sx={{position:"absolute", width: '100%', height:"100%", backgroundColor: 'silver'}}>
            <Box sx={{position:"relative", height:"100%", marginTop: '64px'}}>
                {loading ? <Loader /> : null}
                <MainTab/>
            </Box>
            <MainDrawer/>
        </Box>
    )
}
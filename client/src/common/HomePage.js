import Box from "@mui/material/Box";
import MainTab from "./MainTabPanel";
import MainDrawer from "./MainDrawer";
import * as React from "react";


export default function HomePage() {
    return (
        <Box sx={{position:"absolute", width: '100%', height:"100%"}}>
            <Box sx={{position:"relative", height:"100%", marginLeft: '240px'}}>
                <MainTab/>
            </Box>
            <MainDrawer/>
        </Box>
    )
}
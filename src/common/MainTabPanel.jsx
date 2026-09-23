import { useContext } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MapPanel from "../TabPanels/mapPanel/MapPanel";
import AnalyzePanel from "../TabPanels/analyzePanel/AnalyzePanel";
import StoreContext from "./Store";
import { PageType } from "./GlobalVariables";
import useIsMobile from "../hooks/use-is-mobile.hook";

// Matches drawerWidth in MainDrawer.jsx. On desktop the persistent drawer holds
// this much space on the left, so the tab panel is offset to sit beside it
// (otherwise the tab bar renders underneath the drawer and is unclickable).
const DRAWER_WIDTH = 200;

export default function MainTabPanel() {
    const { pageStore } = useContext(StoreContext);
    const isMobile = useIsMobile();
    const offset = isMobile ? 0 : DRAWER_WIDTH;

    return (
        <div style={{ display: "flex", height: "100%", width: `calc(100% - ${offset}px)`, marginLeft: offset, flexFlow: "column" }}>
            <Box sx={{ flex: "0 1 auto", width: "100%", backgroundColor: "#7f987d" }}>
                <Box sx={{ borderBottom: 2, borderColor: "white" }}>
                    <Tabs
                        value={pageStore.getPage()}
                        onChange={(event, page) => pageStore.selectPage(page)}
                        aria-label="view tabs"
                        TabIndicatorProps={{ style: { background: "white", fontWeight: "bold" } }}
                    >
                        <Tab label="Map" value={PageType.MAP} sx={{ color: "white" }} />
                        <Tab label="Analyze" value={PageType.ANALYZE} sx={{ color: "white" }} />
                    </Tabs>
                </Box>
            </Box>
            <div style={{ flex: "1 1 auto", position: "relative", overflow: "hidden" }}>
                {pageStore.isPage(PageType.MAP) ? <MapPanel /> : <AnalyzePanel />}
            </div>
        </div>
    );
}

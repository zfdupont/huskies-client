import {useContext, useState} from "react";
import {Paper, Drawer, Fab} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import 'leaflet/dist/leaflet.css'

import MainMap from "./MainMap";
import DistrictSummaryTable from "./DistrictSummaryTable";
import StateInfoTable from "./StateInfoTable";
import StoreReducer from '../../common/Store';
import HeatMap from "./HeatMap";
import useIsMobile from "../../hooks/use-is-mobile.hook";

// The three data tables shown beside the map on desktop and inside the bottom
// sheet on mobile. Guarded by the same conditions in both layouts.
function DataTables({mapStore}) {
    return (
        <>
            <div style={{flex: '0', marginBottom: '10px', width: '100%'}}>
                {(!mapStore.isStateNone()) && <StateInfoTable/>}
            </div>
            <Paper style={{display: 'flex', flex: '1', minHeight: 240, width: '100%'}}>
                {(!mapStore.isStateNone()) && <DistrictSummaryTable/>}
            </Paper>
        </>
    );
}

export default function MapPanel() {
    let {mapStore} = useContext(StoreReducer);
    const isMobile = useIsMobile();
    const [sheetOpen, setSheetOpen] = useState(false);

    if (isMobile) {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%'}}>
                <Paper className="map" style={{position: 'absolute', inset: 0}}>
                    <MainMap/>
                    <HeatMap/>
                </Paper>
                {(!mapStore.isStateNone()) && (
                    <Fab
                        size="medium"
                        color="primary"
                        aria-label="Show district data"
                        onClick={() => setSheetOpen(true)}
                        sx={{position: 'absolute', bottom: 16, right: 16, zIndex: 1100}}
                    >
                        <BarChartIcon/>
                    </Fab>
                )}
                <Drawer
                    anchor="bottom"
                    open={sheetOpen}
                    onClose={() => setSheetOpen(false)}
                    PaperProps={{
                        sx: {
                            maxHeight: '75vh',
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            overflow: 'auto',
                        },
                    }}
                >
                    <DataTables mapStore={mapStore}/>
                </Drawer>
            </div>
        );
    }

    return (
        <div style={{position: 'absolute', width: 'calc(100% - 20px)', height:'calc(100% - 0px)', padding: '10px', display:'flex'}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent:'center', flex:3.5, marginRight: '10px'}}>
                <Paper className="map" style={{flex: 1, marginBottom: '10px'}}>
                    <MainMap/>
                    <HeatMap/>
                </Paper>
            </div>
            <div style={{display:'flex', flexDirection:'column', flex:2.5}}>
                <div style={{flex: '0', marginBottom:'10px', height:'100%'}}>
                  {(!mapStore.isStateNone()) && <StateInfoTable/>}
                </div>
                <Paper style={{display:'flex', flex: '1', height: '70%'}}>
                    {(!mapStore.isStateNone()) && <DistrictSummaryTable/>}
                </Paper>
            </div>
        </div>
    );
}

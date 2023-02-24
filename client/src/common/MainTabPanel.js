import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MapPanel from "../TabPanels/mapPanel/MapPanel";
import AnalyzePanel from "../TabPanels/analyzePanel/AnalyzePanel";
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicPanel() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%', backgroundColor:'lightblue'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Map" {...a11yProps(0)} />
                    <Tab label="Analyze" {...a11yProps(1)} />
                    <Tab label="Item 3" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel index={0} value={value}>
                <div style={{position:'absolute', width: '100%', height: "90vh", overflowY: 'scroll'}}>
                    <MapPanel/>
                </div>
            </TabPanel>
            <TabPanel index={1} value={value}>
                <div style={{position:'absolute', width: '100%', height: "90vh", overflowY: 'scroll'}}>
                    <AnalyzePanel/>
                </div>
            </TabPanel>
            <TabPanel index={2} value={value}>
                <div style={{position:'absolute', width: '100%', height: "90vh", overflowY: 'scroll'}}>
                    <MapPanel/>
                </div>
            </TabPanel>
        </Box>
    );
}
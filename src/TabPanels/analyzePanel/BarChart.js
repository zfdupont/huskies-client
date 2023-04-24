import * as React from "react";
import Switch from '@mui/material/Switch';
import './AnalyzePanel.css'
import BarChartComponent from "./BarChartComponent";
import FormControlLabel from '@mui/material/FormControlLabel';

export default function BarChar() {

    function variationOnclick(event) {
        console.log("toggled between population and geographic variation...");
    }

    return(
        <div>
             <FormControlLabel control={ <Switch aria-label='Switch demo' sx={{margin: 1}} onClick={variationOnclick} label="Population Variation" />} label="Variation" />
           

        </div>
    );
}
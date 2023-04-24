import * as React from "react";
import Switch from '@mui/material/Switch';
import './AnalyzePanel.css'
import BarChartComponent from "./BarChartComponent";
import FormControlLabel from '@mui/material/FormControlLabel';

export default function BarChar() {
    const [checked, setChecked] = React.useState(false);

    function variationOnclick(event) {
        console.log("toggled between population and geographic variation...");
        setChecked();
    }


    return(
        <div>
             <FormControlLabel control={ <Switch aria-label='Switch demo' sx={{margin: 1}} onClick={setChecked} />} label={`${checked? 'Population Variation':'Geographic Variation'}`} />
            <BarChartComponent name="Geographic Variation"></BarChartComponent>

        </div>
    );
}
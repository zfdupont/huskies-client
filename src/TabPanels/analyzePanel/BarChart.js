import * as React from "react";
import Switch from '@mui/material/Switch';
import './AnalyzePanel.css'
import BarChartComponent from "./BarChartComponent";
import FormControlLabel from '@mui/material/FormControlLabel';

export default function BarChart(props) {
    const [checked, setChecked] = React.useState(false);

    return(
        <div>
             <FormControlLabel control={ <Switch aria-label='Switch demo' sx={{margin: 1}} onClick={setChecked} />} label={`${checked? 'Population Variation':'Geographic Variation'}`} />
                <BarChartComponent name="Geographic Variation" data={props.data}></BarChartComponent>

        </div>
    );
}
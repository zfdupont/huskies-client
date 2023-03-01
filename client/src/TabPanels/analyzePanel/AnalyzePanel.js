
import * as React from "react";
import './AnalyzePanel.css'
import BarChartComponent from "./BarChartComponent";
import Whisker from "./Whisker.tsx";

export default function AnalyzePanel()
{
    return (
        <div id='Panel' style={{backgroundColor: 'white'}}>
            <div id='barChart'>
                <BarChartComponent name="Geographic Variation"></BarChartComponent>
                <BarChartComponent name="Population Variation"></BarChartComponent>
                <BarChartComponent name="Incumbents Winner"></BarChartComponent>
                <BarChartComponent name="Number of Democratic Seats"></BarChartComponent>
            </div>
            <Whisker></Whisker>
        </div>
    );
}
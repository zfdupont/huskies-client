
import * as React from "react";
import { Bar } from "recharts";
import './AnalyzePanel.css'
import BarChartComponent from "./BarChartComponent";
import Whisker from "./Whisker.tsx";

export default function AnalyzePanel()
{
    return (
        <div id='Panel'>
            <div id='barChart'>
                <BarChartComponent></BarChartComponent>
                <BarChartComponent></BarChartComponent>
                <BarChartComponent style={{padding: 500 }}></BarChartComponent>
            </div>
            <Whisker></Whisker>
        </div>
    );
}
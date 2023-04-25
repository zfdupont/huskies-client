//import "./styles.css";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

export default function BarChartComponent(props) {
  return (
    <BarChart
      width={500}
      height={300}
      data={props.data}
      margin={{
        top: 5,
        right: 30,
        left: 0,
        bottom: 5
      }}
    >
      <text
        x={410}
        y={10}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {/* <tspan fontSize="14">{props.name}</tspan> */}
      </text>

      
      {/* <XAxis dataKey="name" /> */}
      <XAxis
        padding={{ left: 30 }}
        dataKey="name"
        type="number"
        domain={[17, 23]}
        tickCount={7}
      ></XAxis>
      <YAxis />
      <ReferenceLine x={20.5} strokeWidth={3} stroke="#eb3464"/>
      <ReferenceLine x={19.5} strokeWidth={3} stroke="#bce0f5"/>
      <Tooltip />
      <Legend />
      <Bar dataKey="plan" fill="#185a87" barSize={35}/>
    </BarChart>
  );
}

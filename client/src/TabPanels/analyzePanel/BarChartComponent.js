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

const data = [
  {
    name: 17,
    plan: 240
  },
  {
    name: 18,
    plan: 800
  },
  {
    name: 19,
    plan: 850
  },
  {
    name: 20,
    plan: 630
  },
  {
    name: 21,
    plan: 600
  },
  {
    name: 22,
    plan: 380
  },
  {
    name: 23,
    plan: 430
  }
];

export default function BarChartComponent() {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 0,
        bottom: 5
      }}
    >
      <text
        x={400}
        y={10}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan fontSize="14">Geographic Variation</tspan>
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
      <ReferenceLine x={19.5} strokeWidth={3} stroke="#100859"/>
      <Tooltip />
      <Legend />
      <Bar dataKey="plan" fill="#8884d8" barSize={35}/>
    </BarChart>
  );
}

import { useMemo } from "react";
import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  RectangleProps,
  Scatter
} from "recharts";

// Original data of boxplot graph
type BoxPlot = {
  min: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  max: number;
  average?: number;
};

// Used in stacked bar graph
type BoxPlotData = {
  min: number;
  bottomWhisker: number;
  bottomBox: number;
  topBox: number;
  topWhisker: number;
  average?: number;
  size: number; // for average dot size
};

const boxPlots: BoxPlot[] = [
    {
      min: 8,
      lowerQuartile: 12,
      median: 13,
      upperQuartile: 18,
      max: 25,
      average: 14
    },
    {
      min: 10,
      lowerQuartile: 12,
      median: 13,
      upperQuartile: 25,
      max: 30,
      average: 14
    },
    {
      min: 13,
      lowerQuartile: 14,
      median: 16,
      upperQuartile: 27,
      max: 35,
      average: 16
    },
    {
      min: 15,
      lowerQuartile: 19,
      median: 22,
      upperQuartile: 31,
      max: 35,
      average: 25
    },
    {
      min: 20,
      lowerQuartile: 23,
      median: 28,
      upperQuartile: 38,
      max: 40,
      average: 28
    },
    {
      min: 28,
      lowerQuartile: 30,
      median: 33,
      upperQuartile: 35,
      max: 37,
      average: 30
    },
    {
      min: 34,
      lowerQuartile: 35,
      median: 36,
      upperQuartile: 40,
      max: 45,
      average: 40
    },
    {
      min: 40,
      lowerQuartile: 42,
      median: 46,
      upperQuartile: 53,
      max: 55,
      average: 49
    },
    {
      min: 44,
      lowerQuartile: 47,
      median: 49,
      upperQuartile: 58,
      max: 60,
      average: 49
    },
    {
      min: 47,
      lowerQuartile: 49,
      median: 51,
      upperQuartile: 61,
      max: 65,
      average: 51
    },
    {
      min: 54,
      lowerQuartile: 59,
      median: 64,
      upperQuartile: 66,
      max: 75,
      average: 69
    },
    {
      min: 63,
      lowerQuartile: 66,
      median: 69,
      upperQuartile: 78,
      max: 80,
      average: 69
    },
    
  ];

  const HorizonBar = (props: RectangleProps) => {
    const { x, y, width, height } = props;
  
    if (x == null || y == null || width == null || height == null) {
      return null;
    }
  
    return (
      <line x1={x} y1={y} x2={x + width} y2={y} stroke={"#185e87"} strokeWidth={2} />
    );
  };
  
  const DotBar = (props: RectangleProps) => {
    const { x, y, width, height } = props;
  
    if (x == null || y == null || width == null || height == null) {
      return null;
    }
  
    return (
      <line
        x1={x + width / 2}
        y1={y + height}
        x2={x + width / 2}
        y2={y}
        stroke={"#185e87"}
        strokeWidth={2}
        stroke-dasharray={"5"}
      />
    );
  };
  
  const useBoxPlot = (boxPlots: BoxPlot[]): BoxPlotData[] => {
    const data = useMemo(
      () =>
        boxPlots.map((v) => {
          return {
            min: v.min,
            bottomWhisker: v.lowerQuartile - v.min,
            bottomBox: v.median - v.lowerQuartile,
            topBox: v.upperQuartile - v.median,
            topWhisker: v.max - v.upperQuartile,
            average: v.average,
            size: 250
          };
        }),
      [boxPlots]
    );
  
    return data;
  };
  
  export default function App() {
    const data = useBoxPlot(boxPlots);
  
    return (
      <ResponsiveContainer minHeight={600}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Bar stackId={"a"} dataKey={"min"} fill={"none"} />
          <Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />
          <Bar stackId={"a"} dataKey={"bottomWhisker"} shape={<DotBar />} />
          <Bar stackId={"a"} dataKey={"bottomBox"} fill={"#bce0f5"} />
          <Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />
          <Bar stackId={"a"} dataKey={"topBox"} fill={"#bce0f5"} />
          <Bar stackId={"a"} dataKey={"topWhisker"} shape={<DotBar />} />
          <Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />
          <ZAxis type="number" dataKey="size" range={[0, 250]} />
  
          <Scatter dataKey="average" fill={"#185e87"} />
          <XAxis/>
          <YAxis />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
  
import React, { Component } from "react";
import Chart from "react-apexcharts";


class BarChart extends Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          data: [44, 55, 41, 64, 22, 43, 21]
        }, {
          data: [53, 32, 33, 52, 13, 44, 32]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            width: 500
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'top',
              },
            }
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: '12px',
              //colors: ['#fff']
            }
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
          },
          tooltip: {
            shared: true,
            intersect: false
          },
          xaxis: {
            categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
          },
        },
      
      
      };
    }

  

    render() {
      return (
        

        <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="bar" height={350} width={500} />
        </div>


      );
    }
  }

  export default BarChart;

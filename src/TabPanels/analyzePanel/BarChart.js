import React, { Component } from "react";
import Chart from "react-apexcharts";


class BarChart extends Component {



    buildData = function(winner_splits) {
        //for key in winner_splits.ke
        console.log(winner_splits);
        for(let key in Object.keys(winner_splits)) {
            //
            console.log(key);
            console.log(winner_splits[key])
        }
    }

    constructor(props) {
      super(props);

      let winnerData = props.data;
      let a = this.buildData(winnerData);
      //console.log(winnerData);

      this.state = {
      
        series: [{
          data: [9, 0, 5]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            width: 500,
            toolbar: {
                show: false,
                tools: {
                  download: false
                }
            }
          },
          plotOptions: {
            bar: {
            //   dataLabels: {
            //     position: 'top',
            //   },
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
            categories: ['20/6','15/11', '21/5'],
          },
          annotations: {
            xaxis: [
              {
                x: '15/11',
                borderColor: '#775DD0',
                label: {
                  style: {
                    color: 'black',
                  },
                  text: 'Actual Split'
                }
              }
            ]
          }
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

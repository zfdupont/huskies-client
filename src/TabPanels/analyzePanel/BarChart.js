import React, { Component } from "react";
import Chart from "react-apexcharts";


class BarChart extends Component {

    constructor(props) {
      super(props);

      let winnerData = props.winnerData;
      let enactedData = props.enactedData;
      let enactedLabel = ''+enactedData;
      let seriesLabels = [];
      let data = [];
      for(let x in winnerData) {
        seriesLabels.push(''+x);
        data.push(winnerData[x]);
      }
      if(!(enactedLabel in seriesLabels)) {
        seriesLabels.push(''+enactedLabel);
        data.push(0);
      }

      this.state = {
      
        series: [{
          data: data
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
          title: {
            text: 'Ensemble Splits',
            align: 'center'
          },
          yaxis: {
            title: {
              text: '# Occurences',
            }
          },
          xaxis: {
            title: {
              text: 'R/D Splits',
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
            categories: seriesLabels,
          },
          annotations: {
            xaxis: [
              {
                x: enactedLabel,
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

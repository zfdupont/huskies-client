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
      if(!(seriesLabels.includes(enactedLabel))) {
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
          // xaxis: {
          //   title: {
          //     text: 'R/D Splits',
          //   }
          // },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'top',
              },
              //color: ['#185a87']
            }
          },
          dataLabels: {
            // enabled: true,
            // position: 'top',
            // offsetX: -6,
            style: {
              fontSize: '12px',
              colors: ['black']
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
            title: {
              text: 'Republican/Democrat Splits',
            }
          },
          colors: ['#bce0f5'],
          annotations: {
            xaxis: [
              {
                x: enactedLabel,
                strokeDashArray: 0,
                width: '100%',
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

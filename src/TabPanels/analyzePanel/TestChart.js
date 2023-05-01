import React, { Component } from "react";
import Chart from "react-apexcharts";

class TestChart extends Component {

    buildData = function(bw_data) {
        if(!bw_data){
            return [];
        }
        else{
            var boxplot_data = []
            // for (let point in bw_data.geo_variations) {
            //     boxplot_data.push({x: , y: point})
            // }
            bw_data.geo_variations.forEach(function (value, i) {
                boxplot_data.push({x: (i+1), y: value})
            });
            return boxplot_data;
        }
    }
  constructor(props) {
    super(props);
    //var graphData = this.buildData(props.data);
    //console.log(graphData);
    this.state = {
          
        series: [
          {
            type: 'boxPlot',
            data: [
              {
                x: 'Jan 2015',
                y: [54, 66, 69, 75, 88]
              },
              {
                x: 'Jan 2016',
                y: [43, 65, 69, 76, 81]
              },
              {
                x: 'Jan 2017',
                y: [31, 39, 45, 51, 59]
              },
              {
                x: 'Jan 2018',
                y: [39, 46, 55, 65, 71]
              },
              {
                x: 'Jan 2019',
                y: [29, 31, 35, 39, 44]
              },
              {
                x: 'Jan 2020',
                y: [41, 49, 58, 61, 67]
              },
              {
                x: 'Jan 2021',
                y: [54, 59, 66, 71, 88]
              }
            ]
          }
        ],
        options: {
          chart: {
            toolbar: {
                show: false,
                tools: {
                  download: false
                }
            },
            type: 'boxPlot',
            height: 350
          },
          title: {
            text: 'Basic BoxPlot Chart',
            align: 'left'
          },
          plotOptions: {
            boxPlot: {
              colors: {
                upper: '#5C4742',
                lower: '#A5978B'
              }
            }
          }
        },
      
      
      };
  }

  render() {
    return (
      <div className="testchart">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="boxPlot" 
              height={350}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TestChart;
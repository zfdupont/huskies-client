import React, { Component } from "react";
import Chart from "react-apexcharts";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

class TestChart extends Component {
    // state = {
    //     type: 'geo_var'
    // };

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
                
                for(let i = 0; i < value.length; i++) {
                    value[i] =  Math.round((value[i] * 10) * 100)/100;
                    //y[x] = Math.round((y[x] * 100) * 100)/100;
                }
                
                boxplot_data.push({x: (i+1), y: value})
            });
            return boxplot_data;
        }
    }

    handleChange = function(a) {
        console.log(a);
        //this.setState({age : a}); 
    }

  constructor(props) {
    super(props);
    var graphData = this.buildData(props.data);
    //console.log(graphData);
    this.state = { 
        age: 'geo-var',
        series: [
          {
            type: 'boxPlot',
            //data: graphData,
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
            height: 350,
            width: 500
          },
          title: {
            //text: 'Basic BoxPlot Chart',
            align: 'left'
          },
          yaxis: {
            title: {
              text: 'Variation (%)',
            }
          },
          xaxis: {
            title: {
              text: 'District',
            }
          },
          plotOptions: {
            boxPlot: {
              colors: {
                upper: '#bce0f5',
                lower: '#185a87'
              }
            }
          }
        },
      
      
      };
  }

  render() {
    return (
    //   <div className="testchart">
    //     <div className="row">
    //       <div className="mixed-chart">
    //         <Chart
    //           options={this.state.options}
    //           series={this.state.series}
    //           type="boxPlot" 
    //           height={350}
    //           width={500}
    //         />
    //       </div>
    //     </div>
        <div>
        <div style={{display:'flex', flexDirection:'column', flex:'1', overflow: 'auto', minHeight: 0}}>
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="boxPlot" 
                height={350}
                width={500}
                />            
        </div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Variation</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={this.state.age}
                    label="Select"
                    onChange={this.handleChange(this.value)}
                >
                    {/* <MenuItem value="">
                    <em>None</em>
                    </MenuItem> */}
                    <MenuItem value={'geo-var'}>Geo Variation</MenuItem>
                    <MenuItem value={'pop-var'}>Pop Variation</MenuItem>
                    <MenuItem value={'dem-var'}>Demographic Var</MenuItem>
                </Select>
            </FormControl>
        
        </div>

    );
  }
}

export default TestChart;
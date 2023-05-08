import React, { Component } from "react";
import Chart from "react-apexcharts";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

class BoxAndWhiskerChart extends Component {

    buildData = function(bw_data, type) {
        if(!bw_data){
            return [];
        }
        else{
            var boxplot_data = []
            // for (let point in bw_data.geo_variations) {
            //     boxplot_data.push({x: , y: point})
            // }
            var data = [];
            bw_data[type].forEach(function (value, i) {
                for(let i = 0; i < value.length; i++) {
                    let val = value[i];
                    val =  Math.round(val * 1e4) / 1e2;
                    data.push(val);
                    //value[i] =  Math.round((value[i] * 10) * 100)/100;
                }
                
                boxplot_data.push({x: (i+1), y: data})
                data = [];
            });
            return boxplot_data;
        }
    }

    handleChange = (e) => {
        let val = e.target.value;
        var data;
        if(val === 'pop-var') {
          data = this.buildData(this.state.originalData, 'pop_variations');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            }],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }
        if(val === 'geo-var') {
          data = this.buildData(this.state.originalData, 'geo_variations');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            }],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }
        if(val === 'dem-var') {
          data = this.buildData(this.state.originalData, 'vap_black_proportions');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            }],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }


    }

  constructor(props) {
    super(props);
    var graphData = this.buildData(props.data, 'geo_variations');
    this.state = { 
        type: 'geo-var',
        originalData: props.data,
        series: [
          {
            type: 'boxPlot',
            data: graphData
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
            width: 500,
            // sparkline: {
            //     enabled: false
            //   },
            id: 'box-chart',
            parentHeightOffset: 0,
            
          },
          title: {
            text: 'Variation',
            align: 'center'
          },
          yaxis: {
            title: {
              text: 'Variation (%)',
            },
            min: 0,
            max: 100,
            tickAmount: 10,
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
        <div>
        <div style={{}}>
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="boxPlot" 
                height={350}
                width={500}
                id={'box-chart'}
                />            
        </div>
        <FormControl sx={{ m: 1, minWidth: 120, marginLeft: 50 }} size="small">
                <InputLabel id="demo-select-small-label">Variation</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={this.state.type}
                    label="Select"
                    onChange={this.handleChange}
                >
                    <MenuItem value={'geo-var'}>Geo Variation</MenuItem>
                    <MenuItem value={'pop-var'}>Pop Variation</MenuItem>
                    <MenuItem value={'dem-var'}>Demographic Var</MenuItem>
                </Select>
            </FormControl>
        
        </div>

    );
  }
}

export default BoxAndWhiskerChart;
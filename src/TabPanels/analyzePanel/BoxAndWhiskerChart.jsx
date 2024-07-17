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
            var data = [];
            bw_data[type].forEach(function (value, i) {
                for(let i = 0; i < value.length; i++) {
                    let val = value[i];
                    val =  Math.round(val * 1e4) / 1e2;
                    data.push(val);
                }
                
                boxplot_data.push({x: (i+1), y: data})
                data = [];
            });
            return boxplot_data;
        }
    }

    buildScatterData = function(bw_dots, type) {
      var data = [];
      bw_dots[type].forEach(function(value, i) {
          let val = value;
          val =  Math.round(val * 1e4) / 1e2;
          data.push({
            x: (i+1), y: val
          });
      });
      return data;
    }

    handleChange = (e) => {
        let val = e.target.value;
        var data;
        var scatterData;
        if(val === 'pop-var') {
          data = this.buildData(this.state.originalData, 'vap_total_variations');
          scatterData = this.buildScatterData(this.state.originalScatterData, 'vap_total_variation');
          console.log(this.state.series);
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            },
            {
              ...prevState.series,
              data: scatterData
            }
          ],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }
        if(val === 'geo-var') {
          data = this.buildData(this.state.originalData, 'area_variations');
          scatterData = this.buildScatterData(this.state.originalScatterData, 'area_variation');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            },
            {
              ...prevState.series,
              data: scatterData
            }],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }
        if(val === 'black-var') {
          data = this.buildData(this.state.originalData, 'vap_black_variations');
          scatterData = this.buildScatterData(this.state.originalScatterData, 'vap_black_variation');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            },
            {
              ...prevState.series,
              data: scatterData
            }],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }
        if(val === 'hispanic-var') {
          data = this.buildData(this.state.originalData, 'vap_hisp_variations');
          scatterData = this.buildScatterData(this.state.originalScatterData, 'vap_hisp_variation');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            },
            {
              ...prevState.series,
              data: scatterData
            }],
            options:{ ...prevState.options,
              chart: {
                  ...prevState.chart,
                  id: 'pie-chart'
              }
            }
          }));
        }
        if(val === 'white-var') {
          data = this.buildData(this.state.originalData, 'vap_white_variations');
          scatterData = this.buildScatterData(this.state.originalScatterData, 'vap_white_variation');
          this.setState((prevState) => ({
            ...prevState,
            type: val,
            series: [{
              ...prevState.series,
              data: data
            },
            {
              ...prevState.series,
              data: scatterData
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
    var enactedData = props.enactedData;
    var graphData = this.buildData(props.data, 'area_variations');
    var scatterData = this.buildScatterData(enactedData.box_w_dots, 'area_variation');
    this.state = { 
        type: 'geo-var',
        originalData: props.data,
        originalScatterData: enactedData.box_w_dots,
        series: [
          {
            name: 'Predicted Variation',
            type: 'boxPlot',
            data: graphData
          },
          {
            name: 'Actual Variation',
            type: 'scatter',
            data: scatterData
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
            id: 'box-chart',
            parentHeightOffset: 0,
            
          },
          title: {
            text: 'District Plans Ensemble Variation',
            align: 'center'
          },
          yaxis: {
            title: {
              text: 'Variation (%)',
            },
            min: 0,
            //max: function(max) { return max + 5 },
            forceNiceScale: true
            //tickAmount: 10,
          },
          xaxis: {
            title: {
              text: 'Indexed Districts',
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
                    <MenuItem value={'black-var'}>Black Pop Var</MenuItem>
                    <MenuItem value={'hispanic-var'}>Hispanic Pop Var</MenuItem>
                    <MenuItem value={'white-var'}>White Pop Var</MenuItem>
                </Select>
            </FormControl>
        
        </div>

    );
  }
}

export default BoxAndWhiskerChart;
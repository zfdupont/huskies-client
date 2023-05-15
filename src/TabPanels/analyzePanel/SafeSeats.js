import React, { Component } from "react";
import Chart from "react-apexcharts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

class SafeSeats extends React.Component {

    buildData = function(data) {
        let safeSeatData = {'safeSeries': [data['incumbent'], data['open_seat']], 'safeLabels': ['Incumbent', 'Open Seats'], 'incumbentSeries': [data['dem-incmb'], data['rep-incmb']], 'incumbentLabels': ['Democrat', 'Republican'], 'openSeries': [data['dem-open'], data['rep-open']], 'openLabels': ['Democrat', 'Republican']}
        return safeSeatData;
    }

    constructor(props) {
      super(props);

      var data = this.buildData(props.data)

      this.state = {
        data: data,
        currentShow: 'safe-seats',
        series: data['safeSeries'],
        options: {
          chart: {
            events: {
                dataPointSelection: (event, chartContext, config) =>  
                setTimeout(() => {this.setData(config.w.config.labels[config.dataPointIndex])}, 10),
            },
            width: 380,
            height: 500,
            type: 'pie',
            id: 'pie-chart',
            toolbar: {
                show: false,
                tools: {
                  download: false
                }
            },
            // donut: {
            //     size: '110%'
            //   },
          },
          colors: ['#FF5A5F', '#BFD7EA'],
          labels: data['safeLabels'],
          title: {
            text: 'Safe Seats',
            align: 'left',
            margin: 30,
            offsetX: 50,
            offsetY: -10,
            floating: true
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 380
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },      
      };
    }
    setData = function(selected) {
        let d = this.state.data;
        if(selected === 'Incumbent') {
            this.setState((prevState) => ({
                ...prevState,
                series: d['incumbentSeries'],
                options:{ ...prevState.options,
                    labels: d['incumbentLabels'],
                    title: {
                        ...prevState.title,
                        text: 'Incumbent Seats (Democrat vs Republican)'
                    },
                    chart: {
                        ...prevState.chart,
                        id: 'pie-chart'
                    }
                  }
            }));
        }
        if(selected === 'Open Seats') {
            this.setState((prevState) => ({
                ...prevState,
                series: d['openSeries'],
                options:{ ...prevState.options,
                    labels: d['openLabels'],
                    title: {
                        ...prevState.title,
                        text: 'Open Seats (Democrat vs Republican)'
                    },
                    chart: {
                        ...prevState.chart,
                        id: 'pie-chart'
                    }
                  }
            }));
        }
        if(selected === 'Democrat' || selected === 'Republican') {
            this.setState((prevState) => ({
                ...prevState,
                series: d['safeSeries'],
                options:{ ...prevState.options,
                    labels: d['safeLabels'],
                    title: {
                        ...prevState.title,
                        text: 'Safe Seats'
                    },
                    chart: {
                        ...prevState.chart,
                        id: 'pie-chart'
                    }
                  }
            }));
        }
    }
    render() {
      return (
        <div style={{display: 'flex'}}>
            {/* <Chart options={this.state.options} series={this.state.series} type="pie" width={380} id={'pie-chart'} /> */}
            
            <TableContainer sx={{ width: 260}}>
                <Table size="small" sx={{ width: 260}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: 12, width: '50%' }} align="center">District</TableCell>
                            <TableCell sx={{ fontSize: 12, width: '50%' }} align="center">Incumbent/Open Seat</TableCell>
                            <TableCell sx={{ fontSize: 12, width: '50%' }} align="center">Victory Margin</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            key={'summary'}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{ fontSize: 12 }} align="center">1</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">1</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">1</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Chart options={this.state.options} series={this.state.series} type="pie" width={380} id={'pie-chart'} />
        </div>
      );
    }
  }

export default SafeSeats;
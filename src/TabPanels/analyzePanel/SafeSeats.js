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
      
      var data = this.buildData(props.data['data']);
      var table = props.data['table'];
      console.log(table);

      this.state = {
        data: data,
        table: table,
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
          },
          colors: ['#BFD7EA', '#FF5A5F'],
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
            <TableContainer sx={{ width: 260, height: 280}}>
                <Table size="small" sx={{ width: 260}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: 13, width: '50%', fontWeight: 'bold' }} align="left">District</TableCell>
                            <TableCell sx={{ fontSize: 13, width: '50%', fontWeight: 'bold' }} align="left">Incumbent/Open Seat</TableCell>
                            <TableCell sx={{ fontSize: 13, width: '50%', fontWeight: 'bold' }} align="left">Victory Margin</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.table.map((row) => (
                                <TableRow
                                    key={'summary'}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ fontSize: 13 }} align="left">{row.districtId}</TableCell>
                                    <TableCell sx={{ fontSize: 13 }} align="left">{row.incumbent ? 'Incumbent' : 'Open Seat'}</TableCell>
                                    <TableCell sx={{ fontSize: 13 }} align="left">{row.victoryMargin+'%'}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Chart options={this.state.options} series={this.state.series} type="pie" width={380} id={'pie-chart'} />
        </div>
      );
    }
  }

export default SafeSeats;
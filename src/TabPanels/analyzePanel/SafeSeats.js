import React, { Component } from "react";
import Chart from "react-apexcharts";

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
            type: 'pie',
            id: 'pie-chart'
          },
          labels: data['safeLabels'],
          title: {
            text: 'Safe Seats',
            align: 'center'
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
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
                        text: 'Incumbent Seats'
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
                        text: 'Open Seats'
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
        <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="pie" width={380} id={'pie-chart'} />
        </div>
      );
    }
  }

export default SafeSeats;
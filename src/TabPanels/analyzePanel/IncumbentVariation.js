import React, { Component } from "react";
import Chart from "react-apexcharts";


class IncumbentVariation extends Component {

    calculateDifferences = function(variations) {
        let vars = variations;
        let differences = {};
        for(let i = 0; i < 100; i+=2) {
            differences[i+1] = 0;
        }
        for(let x = 0; x < vars.length; x++) {
            let temp = vars[x];
            let y = Math.round(temp * 1e4) / 1e2;
            y = Math.round(y);
            if(y in differences) {
                differences[y] += 1;
            }
            else if((y-1) in differences) {
                differences[y-1] += 1;
            }
        }
          let variationDifferences = {}
        for(let key in differences) {
            if(differences[key] !== 0) {
                variationDifferences[key] = differences[key];
            }
        }
        return variationDifferences;

    }

    buildData = function(enacted, incumbent_data, incumbent) {
        let geo_variations = this.calculateDifferences(incumbent_data[incumbent].area_variations);
        let pop_variations = this.calculateDifferences(incumbent_data[incumbent].vap_total_variations);
        console.log(geo_variations);
        console.log(pop_variations);

        let labelKeys = Object.keys(geo_variations).concat(Object.keys(pop_variations));
        labelKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        //so this is functioning as a index...
        

        let data = {'geo': geo_variations, 'pop': pop_variations};


        return data;
    }

    returnCategories = function(geo_var, pop_var) {

    }

    constructor(props) {
      super(props);
      let enactedData = props.enactedData;
      let incumbentData = props.incumbentData;
      let incumbent = props.incumbent;
      let data = this.buildData(enactedData, incumbentData, incumbent);
      let geo_variations = data.geo;
      let pop_variations = data.pop;
    //   let labelKeys = Object.keys(geo_variations).concat(Object.keys(pop_variations));
    //   labelKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    //   console.log(labelKeys);
    let labelKeys = Object.keys(geo_variations);
    labelKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      let labelsMap = { 1 : '1-2%', 3: '3-4%', 5: '5-6%', 7: '7-8%', 9: '9-10%', 11: '11-12%', 13: '13-14%', 15: '15-16%', 17: '17-18%',
      19: '19-20%', 21: '21-22%', 23: '23-24%', 25: '25-26%', 27: '27-28%', 29: '29-30%', 31: '31-32%', 33: '33-34%', 35: '35-36%', 
      37: '37-38%', 39: '39-40%', 41: '41-42%', 43: '43-44%', 45: '45-46%', 47: '47-48%', 49: '49-50%', 51: '51-52%', 53: '53-54%', 
      55: '55-56%', 57: '57-58%', 59: '59-60%', 61: '61-62%', 63: '63-64%', 65: '65-66%', 67: '67-68%', 69: '69-70%', 71: '71-72%', 
      73: '73-74%', 75: '75-76%', 77: '77-78%', 79: '79-80%', 81: '81-82%', 83: '83-84%', 85: '85-86%', 87: '87-88%', 89: '89-90%', 
      91: '91-92%', 93: '93-94%', 95: '95-96%', 97: '97-98%', 99: '99-100%'};
      
      let allLabels = [];
      let data2 = [];
      for(let key in labelKeys){
        data2.push(geo_variations[labelKeys[key]]);
        allLabels.push(labelsMap[labelKeys[key]]);
      }
      data2.push(0);
      console.log(allLabels);
      console.log(data2);

      this.state = {
      
        series: [{
          data: data2
        }],// { data: [9, 0, 5]}],
        options: {
          grid: {
            show: false,
            padding: {
                //left: -100,
                //right: -100
            }
          },
          chart: {
            type: 'bar',
            height: 350,
            width: 350,
            // sparkline: {
            //     enabled: false
            //   },
              
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
              columnWidth: '50%',
            }
          },
          dataLabels: {
            enabled: true,
            offsetX: 0,
            //rotate: -90,
            //offsetY: 100,
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
            categories: allLabels,
          },
          yaxis: {
            //opposite: true
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
            <Chart options={this.state.options} series={this.state.series} type="bar" height={350} width={350} />
      );
    }
  }

  export default IncumbentVariation;

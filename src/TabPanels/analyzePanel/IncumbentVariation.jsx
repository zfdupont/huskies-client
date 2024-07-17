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

    calculatePercentVariation = function(actual) {
        let temp = actual;
        let y = Math.round(temp * 1e4) / 1e2;
        y = Math.round(y);
        return y;
    }

    buildData = function(enacted, incumbent_data, type) {
        let labelsMap = { 1 : '1-2', 3: '3-4', 5: '5-6', 7: '7-8', 9: '9-10', 11: '11-12', 13: '13-14', 15: '15-16', 17: '17-18',
            19: '19-20', 21: '21-22', 23: '23-24', 25: '25-26', 27: '27-28', 29: '29-30', 31: '31-32', 33: '33-34', 35: '35-36', 
            37: '37-38', 39: '39-40', 41: '41-42', 43: '43-44', 45: '45-46', 47: '47-48', 49: '49-50', 51: '51-52', 53: '53-54', 
            55: '55-56', 57: '57-58', 59: '59-60', 61: '61-62', 63: '63-64', 65: '65-66', 67: '67-68', 69: '69-70', 71: '71-72', 
            73: '73-74', 75: '75-76', 77: '77-78', 79: '79-80', 81: '81-82', 83: '83-84', 85: '85-86', 87: '87-88', 89: '89-90', 
            91: '91-92', 93: '93-94', 95: '95-96', 97: '97-98', 99: '99-100'};
        let finalData = [];  

        if(type === 'area_variations') {
            let geo_variations = this.calculateDifferences(incumbent_data[type]);
            let actual_geo_var = this.calculatePercentVariation(enacted['area_variation']);
            let labelKeys = Object.keys(geo_variations);
            labelKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
            for(let key in labelKeys){
                if((actual_geo_var == labelKeys[key]) || (actual_geo_var - 1) == labelKeys[key]) {
                    finalData.push({
                        x: labelsMap[labelKeys[key]],
                        y: geo_variations[labelKeys[key]],
                        fillColor: '#fc0345'
                    });
                }
                // '#bce0f5',
                // lower: '#185a87'
                else {
                    finalData.push({
                        x: labelsMap[labelKeys[key]],
                        y: geo_variations[labelKeys[key]],
                        fillColor: '#185a87'
                    });

                }
            }
        }
        if(type === 'vap_variations') {
            let geo_variations = this.calculateDifferences(incumbent_data['vap_total_variations']);
            let actual_geo_var = this.calculatePercentVariation(enacted['vap_total_variation']);
            let labelKeys = Object.keys(geo_variations);
            labelKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
            for(let key in labelKeys){
                if((actual_geo_var == labelKeys[key]) || (actual_geo_var - 1) == labelKeys[key]) {
                    finalData.push({
                        x: labelsMap[labelKeys[key]],
                        y: geo_variations[labelKeys[key]],
                        fillColor: '#fc0345' 
                    });
                }
                else {
                    finalData.push({
                        x: labelsMap[labelKeys[key]],
                        y: geo_variations[labelKeys[key]],
                        fillColor: '#185a87'
                    });

                }
            }
        }



        return finalData;
    }

    returnCategories = function(geo_var, pop_var) {

    }

    constructor(props) {
      super(props);
      let enactedData = props.enactedData;
      let incumbentData = props.incumbentData;
      let incumbent = props.incumbent;
      let type = props.type;
      let data = this.buildData(enactedData[incumbent], incumbentData[incumbent], type);

      this.state = {
        series: [{
          name: 'Variations',
          data: data
        }],
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
            width: 400,
            offsetX: 50,
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
              columnWidth: '50%',
            }
          },
          dataLabels: {
            enabled: false,
            offsetX: 0,
            //rotate: -90,
            //offsetY: 100,
            style: {
              fontSize: '12px',
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
          title: {
            text: type === 'area_variations' ? 'Geographic Variation for '+incumbent : 'Population Variation for '+incumbent,
            align: 'center',
            offsetY: 20
          },
          xaxis: {
            title: {
                text: 'Changes in Range (%) ',
                offsetY: -35
              },
          },
          yaxis: {
            title: {
                text: '# Occurences',
              },
          }
        },
      
      
      };
    }

  

    render() {
      return (
            <Chart options={this.state.options} series={this.state.series} type="bar" height={350} width={400} />
      );
    }
  }

  export default IncumbentVariation;

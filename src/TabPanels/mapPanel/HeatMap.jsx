import {useContext} from 'react';
import StoreContext from "../../common/Store";
import {democraticColors, MapFilterType, populationColors, republicanColors} from "../../common/GlobalVariables";
import {convertMapFilterTypeToPopulationType} from "../../common/ConversionHelper";


export default function HeatMap() {
    let { mapStore, dataStore } = useContext(StoreContext);
    if (!dataStore.isReadyToDisplayCurrentMap() || mapStore.mapFilterType === MapFilterType.NONE) return;
    let heatMapData = dataStore.getStateModelData(mapStore.plan, mapStore.state).heatMapData;
    let featureValues;
    let firstHeatMapColors;
    let secondHeatMapColors;
    if (mapStore.mapFilterType === MapFilterType.VICTORYMARGIN) {
        firstHeatMapColors = republicanColors;
        secondHeatMapColors = democraticColors
        featureValues = heatMapData.victoryMarginFeatureValues;
    }
    else {
        firstHeatMapColors = populationColors;
        let populationType = convertMapFilterTypeToPopulationType(mapStore.mapFilterType);
        featureValues = heatMapData.getFeatureValuesByPopulationType(populationType);
    }
    let heatMapGuides = [];
    featureValues = [0, ...featureValues];
    for (let i = 0; i < firstHeatMapColors.length; i++) {
        let colorLine = <div style={{flex:'0 0 15px', marginRight:'5px', backgroundColor: firstHeatMapColors[i]}}/>;
        let featureValue = "> " + featureValues[i].toLocaleString();
        if (mapStore.mapFilterType === MapFilterType.VICTORYMARGIN) {
            colorLine =
            <div style={{display:'flex', flex:'0 0 15px', marginRight:'5px'}}>
                <div style={{flex:'1', backgroundColor: firstHeatMapColors[i]}}/>
                <div style={{flex:'1', backgroundColor: secondHeatMapColors[i]}}/>
            </div>
            featureValue = featureValue + " %"
        }
        heatMapGuides.push(
            <div style={{display:'flex', flex:'1', marginTop:'2px'}}>
                {colorLine}
                <div style={{display:'flex', flex:'1', justifyContent:'left'}}>{featureValue}</div>
            </div>
        )
    }
    return (
        <div style={{display:'flex', position: 'relative', width: '10%', height:'150px', top:'-160px', marginLeft:'5px', padding:'5px', borderRadius:'5px', backgroundColor:'rgba(255,255,255,0.73)', zIndex: 800}}>
            <div style={{display:'flex', flexDirection:'column', flex:'1px', fontSize:'12px'}}>
                {heatMapGuides}
            </div>
        </div>
    )
}

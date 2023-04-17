import {LayerGroupType, FilterType} from "./Enums";
import StateModel from "../models/StateModel";


export function filterToLayerGroup(filterType){
    switch(filterType)
    {
        case FilterType.DEMOCRAT: return LayerGroupType.DEMOCRAT;
        case FilterType.REPUBLICAN: return LayerGroupType.REPUBLICAN;
        case FilterType.INCUMBENT: return LayerGroupType.INCUMBENT;
        case FilterType.DIFFERENCE: return LayerGroupType.DIFFERENCE;
    }
}

export function filterToStyle(filterType){
    switch(filterType)
    {
        case FilterType.DEMOCRAT: return "demStyle";
        case FilterType.REPUBLICAN: return "repStyle";
        case FilterType.INCUMBENT: return "incStyle";
        case FilterType.DIFFERENCE: return "diffStyle";
    }
}

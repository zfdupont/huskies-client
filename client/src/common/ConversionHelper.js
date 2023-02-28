import {LayerGroupType, FilterType} from "./Enums";

let convertType = {};

convertType.filterToLayerGroup = (filterType) => {
    switch(filterType)
    {
        case FilterType.DEMOCRAT: return LayerGroupType.DEMOCRAT;
        case FilterType.REPUBLICAN: return LayerGroupType.REPUBLICAN;
        case FilterType.INCUMBENT: return LayerGroupType.INCUMBENT;
        case FilterType.DIFFERENCE: return LayerGroupType.DIFFERENCE;
    }
}

convertType.filterToStyle = (filterType) => {
    switch(filterType)
    {
        case FilterType.DEMOCRAT: return "demStyle";
        case FilterType.REPUBLICAN: return "repStyle";
        case FilterType.INCUMBENT: return "incStyle";
        case FilterType.DIFFERENCE: return "diffStyle";
    }
}

export default convertType

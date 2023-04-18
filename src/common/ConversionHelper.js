import {LayerGroupType, FilterType} from "./Enums";


export function filterToLayerGroup(filterType){
    // eslint-disable-next-line default-case
    switch(filterType)
    {
        case FilterType.INCUMBENT: return LayerGroupType.INCUMBENT;
        case FilterType.PARTY: return LayerGroupType.PARTY;
        case FilterType.WHITE: return LayerGroupType.WHITE;
        case FilterType.BLACK: return LayerGroupType.BLACK;
        case FilterType.ASIAN: return LayerGroupType.ASIAN;
    }
}

export function filterToStyle(filterType){
    // eslint-disable-next-line default-case
    switch(filterType)
    {
        case FilterType.INCUMBENT: return "incumbentStyle";
        case FilterType.PARTY: return "partyStyle";
        case FilterType.WHITE: return "demographicStyle";
        case FilterType.BLACK: return "demographicStyle";
        case FilterType.ASIAN: return "demographicStyle";
    }
}

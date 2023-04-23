import {LayerGroupType, FilterType, StyleType, BoundSizeMap, ZoomLevelMap} from "./Enums";


export function convertFilterTypeToLayerType(filterType){
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

export function convertFilterTypeToStyleType(filterType){
    // eslint-disable-next-line default-case
    switch(filterType)
    {
        case FilterType.INCUMBENT: return StyleType.INCUMBENT;
        case FilterType.PARTY: return StyleType.PARTY;
        case FilterType.WHITE: return StyleType.DEMOGRAPHIC;
        case FilterType.BLACK: return StyleType.DEMOGRAPHIC;
        case FilterType.ASIAN: return StyleType.DEMOGRAPHIC;
    }
}

export function convertBoundSizeToZoomLevel(targetSize)
{
    let boundSizes = [
        BoundSizeMap.Level6,
        BoundSizeMap.Level5,
        BoundSizeMap.Level4,
        BoundSizeMap.Level3,
        BoundSizeMap.Level2,
        BoundSizeMap.Level1
    ];
    let zoomLevels = [
        ZoomLevelMap.Level6,
        ZoomLevelMap.Level5,
        ZoomLevelMap.Level4,
        ZoomLevelMap.Level3,
        ZoomLevelMap.Level2,
        ZoomLevelMap.Level1,
    ];

    for (let i = 0; i < boundSizes.length; i++) {
        if (targetSize > boundSizes[i])
            return zoomLevels[i]
    }
    return ZoomLevelMap.Level6;
}
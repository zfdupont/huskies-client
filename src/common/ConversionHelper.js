import {LayerGroupType, MapFilterType, StyleType, boundSizeDict, zoomLevelDict, PopulationType} from "./GlobalVariables";


export function convertMapFilterTypeToLayerType(filterType){
    // eslint-disable-next-line default-case
    switch(filterType)
    {
        case MapFilterType.PARTY: return LayerGroupType.PARTY;
        case MapFilterType.WHITE: return LayerGroupType.WHITE;
        case MapFilterType.BLACK: return LayerGroupType.BLACK;
        case MapFilterType.ASIAN: return LayerGroupType.ASIAN;
    }
}

export function convertMapFilterTypeToStyleType(filterType){
    // eslint-disable-next-line default-case
    switch(filterType)
    {
        case MapFilterType.PARTY: return StyleType.PARTY;
        case MapFilterType.WHITE: return StyleType.DEMOGRAPHIC;
        case MapFilterType.BLACK: return StyleType.DEMOGRAPHIC;
        case MapFilterType.ASIAN: return StyleType.DEMOGRAPHIC;
    }
}

export function convertMapFilterTypeToPopulationType(filterType){
    // eslint-disable-next-line default-case
    switch(filterType)
    {
        case MapFilterType.WHITE: return PopulationType.WHITE;
        case MapFilterType.BLACK: return PopulationType.BLACK;
        case MapFilterType.ASIAN: return PopulationType.ASIAN;
        default: return PopulationType.NONE;
    }
}

export function convertBoundSizeToZoomLevel(targetSize)
{
    let boundSizes = [
        boundSizeDict.level6,
        boundSizeDict.level5,
        boundSizeDict.level4,
        boundSizeDict.level3,
        boundSizeDict.level2,
        boundSizeDict.level1
    ];
    let zoomLevels = [
        zoomLevelDict.level6,
        zoomLevelDict.level5,
        zoomLevelDict.level4,
        zoomLevelDict.level3,
        zoomLevelDict.level2,
        zoomLevelDict.level1,
    ];

    for (let i = 0; i < boundSizes.length; i++) {
        if (targetSize > boundSizes[i])
            return zoomLevels[i]
    }
    return zoomLevelDict.level6;
}

export const convertNumToPlace = (n) => {
    const last = n % 10;
    switch (last){
        case 1:
            return `${n}st`;
        case 2:
            return `${n}nd`;
        case 3:
            return `${n}rd`;
        default:
            return `${n}th`;
    }
}
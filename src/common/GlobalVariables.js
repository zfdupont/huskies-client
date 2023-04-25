import NY from "../0.data/NY.json";
import NYD from "../0.data/NYD.json";
import GA from "../0.data/GA.json";
import GAD from "../0.data/GAD.json"
import IL from "../0.data/IL.json";
import ILD from "../0.data/ILD.json";


export const MapActionType = {
    SELECT_PLAN: "selectPlan",
    SELECT_SUB_PLAN: "selectSubPlan",
    SELECT_STATE: "selectState",
    UNSELECT_STATE: "unselectState",
    UPDATE_COLOR_FILTER: "updateColorFilter",
    UPDATE_INCUMBENT_FILTER: "updateIncumbentFilter",
    HIGHLIGHT_DISTRICT: "highlightDistrict",
    SET_HEATMAP_FEATURE_VALUES: 'addHeatmapFeatureValues',
    RESET_STATE: 'resetState',
    RESET_PAGE: 'resetPage',
}

export const DataActionType = {
    ADD_STATE_DATA: "add_state_data",
}

export const PageActionType = {
    UPDATE_TAB: "change_tab",
}

// @enum {string}
export const TabType = {
    MAP: "map",
    ANALYZE: "analyze",
}

// @enum {string}
export const RefType = {
    MAPCONTROLLER: "mapController",
}

// @enum {string}
export const PlanType = {
    Y2022: "Enacted",
}

// @enum {string}
export const StateType = {
    NONE: "none",
    NEWYORK: "NY",
    GEORGIA: "GA",
    ILLINOIS: "IL",
}

// @enum {string}
export const PartyType = {
    DEMOCRATIC: "democratic",
    REPUBLICAN: "republican",
}

// @enum {string}
export const MapFilterType = {
    NONE: 'none',
    INCUMBENT: 'incumbent',
    VICTORYMARGIN: "party",
    WHITE: "white",
    BLACK: "black",
    ASIAN: "asian",
}

// @enum {string}
export const PopulationType = {
    NONE: 'none',
    TOTAL: 'total',
    WHITE: 'white',
    BLACK: 'black',
    ASIAN: 'asian',
}

// @enum {string}
export const StyleType = {
    VICTORYMARGIN: 'partyStyle',
    INCUMBENT: 'incumbentStyle',
    DEMOGRAPHIC: 'demographicStyle',
    HIGHLIGHT: 'highlightStyle',
}

// @enum {string}
export const TileLayerType = {
    PLACE_LABEL: "placeLabel",
    white: "defaultWhite",
}

// @enum {string}
export const LayerGroupType = {
    STATE_DEFAULT: "stateDefault",
    COUNTRY_DEFAULT: "countryDefault",
    INCUMBENT: "incumbent",
    VICTORYMARGIN: "party",
    WHITE: "white",
    BLACK: "black",
    ASIAN: "asian",
    HIGHLIGHT: "highlight",
}

// @enum {string}
export const GeoDataType = {
    STATE: "state",
    DISTRICT: "district",
    PRECINCT: "precinct",
}


export const boundSizeDict = {
    level1: 0,
    level2: 25000,
    level3: 30000,
    level4: 50000,
    level5: 100000,
    level6: 250000,
}

export const zoomLevelDict = {
    level1: 11,
    level2: 10,
    level3: 9,
    level4: 8,
    level5: 7,
    level6: 6,
}

export const colorDict = {
    white: "#ffffff",
    highlight: "#ffe8a4",
    democraticLevel1: "#ffb6a1",
    democraticLevel2: "#ff8963",
    democraticLevel3: "#ff4000",
    democraticLevel4: "#ff2000",
    democraticLevel5: "#d91000",
    democraticLevel6: "#b30000",
    republicanLevel1: "#aec1ff",
    republicanLevel2: "#507bff",
    republicanLevel3: "#0040ff",
    republicanLevel4: "#0020ff",
    republicanLevel5: "#0010d9",
    republicanLevel6: "#0000b3",
    populationLevel1: "#b8ffb8",
    populationLevel2: "#7eff7e",
    populationLevel3: "#33e533",
    populationLevel4: "#22b422",
    populationLevel5: "#087e08",
    populationLevel6: "#004900",
}

export const democraticColors = [
    colorDict.democraticLevel1,
    colorDict.democraticLevel2,
    colorDict.democraticLevel3,
    colorDict.democraticLevel4,
    colorDict.democraticLevel5,
    colorDict.democraticLevel6,
]

export const republicanColors = [
    colorDict.republicanLevel1,
    colorDict.republicanLevel2,
    colorDict.republicanLevel3,
    colorDict.republicanLevel4,
    colorDict.republicanLevel5,
    colorDict.republicanLevel6,
]

export const populationColors = [
    colorDict.populationLevel1,
    colorDict.populationLevel2,
    colorDict.populationLevel3,
    colorDict.populationLevel4,
    colorDict.populationLevel5,
    colorDict.populationLevel6,
]


export const GeoData = {}
GeoData[StateType.NEWYORK] = {}
GeoData[StateType.NEWYORK][GeoDataType.STATE] = NY;
GeoData[StateType.NEWYORK][GeoDataType.DISTRICT] = NYD;

GeoData[StateType.GEORGIA] = {}
GeoData[StateType.GEORGIA][GeoDataType.STATE] = GA;
GeoData[StateType.GEORGIA][GeoDataType.DISTRICT] = GAD;

GeoData[StateType.ILLINOIS] = {}
GeoData[StateType.ILLINOIS][GeoDataType.STATE] = IL;
GeoData[StateType.ILLINOIS][GeoDataType.DISTRICT] = ILD;

export const availableStateTypes = [
    StateType.NEWYORK,
    StateType.GEORGIA,
    StateType.ILLINOIS,
]

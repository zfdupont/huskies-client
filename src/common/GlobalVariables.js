import NY from "../0.data/NY.json";
import NYD from "../0.data/NYD.json";
import GA from "../0.data/GA.json";
import GAD from "../0.data/GAD.json"
import IL from "../0.data/IL.json";
import ILD from "../0.data/ILD.json";


export const MapActionType = {
    SELECT_PLAN: "selectPlan",
    ADD_PLAN_FILTER: "addPlanFilter",
    REMOVE_PLAN_FILTER: "removePlanFilter",
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
    Y2022: "enacted",
    S0001: "democrat_favored",
    S0002: "republican_favored",
    S0003: "fair_geo_pop_var",
    S0004: "high_geo_pop_var",
    S0005: "fair_seat_vote",
}

export const PlanTitleType = {
    [PlanType.Y2022]: "2022 enacted",
    [PlanType.S0001]: "Fairest Seat Vote",
    [PlanType.S0002]: "Fair Geo / Pop.",
    [PlanType.S0003]: "Highest Geo / Pop.",
    [PlanType.S0004]: "Most Dem Favored",
    [PlanType.S0005]: "Most Rep Favored",
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
    PLANFILTER: "planFilter",
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
    black: "#000000",
    highlight: "#ffe8a4",
    outlineLevel1: "#6b0000",
    outlineLevel2: "#6b3900",
    outlineLevel3: "#006b19",
    outlineLevel4: "#00466b",
    outlineLevel5: "#34006b",
    democraticDefault: "#0984e3",
    democraticLevel1: "#aec1ff",
    democraticLevel2: "#507bff",
    democraticLevel3: "#0040ff",
    democraticLevel4: "#0020ff",
    democraticLevel5: "#0010d9",
    democraticLevel6: "#0000b3",
    republicanDefault: "#d63031",
    republicanLevel1: "#ffb6a1",
    republicanLevel2: "#ff8963",
    republicanLevel3: "#ff4000",
    republicanLevel4: "#ff2000",
    republicanLevel5: "#d91000",
    republicanLevel6: "#b30000",
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

export const outlineColors = [
    colorDict.outlineLevel1,
    colorDict.outlineLevel2,
    colorDict.outlineLevel3,
    colorDict.outlineLevel4,
    colorDict.outlineLevel5,
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

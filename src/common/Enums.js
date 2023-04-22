import StateGeoJson from "../0.data/states.json";
import NY from "../0.data/NY.json";
import NYD from "../0.data/NYD.json";
import GA from "../0.data/GA.json";
import GAD from "../0.data/GAD.json"
import IL from "../0.data/IL.json";
import ILD from "../0.data/ILD.json";


export const TabType = {
    MAP: "map",
    ANALYZE: "analyze",
}

export const RefType = {
    MAPCONTROLLER: "mapController",
}

// Y = Year, S = Simulation.
export let PlanType = {
    Y2022: "Enacted",
}

export const StateType = {
    NONE: "none",
    NEWYORK: "NY",
    GEORGIA: "GA",
    ILLINOIS: "IL",
}
export const PartyType = {
    DEMOCRATIC: "democratic",
    REPUBLICAN: "republican",
}

export const CandidateType = {
    DEMOCRATIC: "democraticCandidate",
    REPUBLICAN: "republicanCandidate",
    INCUMBENT: "incumbent",
}

export const FilterType = {
    NONE: 'none',
    INCUMBENT: "incumbent",
    PARTY: "party",
    WHITE: "white",
    BLACK: "black",
    ASIAN: "asian",
}

// LayerType string must match the layer name in MapProperty.json.
export const TileLayerType = {
    PLACE_LABEL: "placeLabel",
    DEFAULT_WHITE: "defaultWhite",
}

export const LayerGroupType = {
    STATE_DEFAULT: "stateDefault",
    COUNTRY_DEFAULT: "countryDefault",
    INCUMBENT: "incumbent",
    PARTY: "party",
    WHITE: "white",
    BLACK: "black",
    ASIAN: "asian",
    HIGHLIGHT: "highlight",
}

export const ColorDictionary = {
    DEFAULT_WHITE : "#ffffff",
    DEMOCRATIC_LV1 : "#fdb4b4",
    DEMOCRATIC_LV2 : "#ff7f7f",
    DEMOCRATIC_LV3 : "#ff6363",
    DEMOCRATIC_LV4 : "#ff2b2b",
    DEMOCRATIC_LV5 : "#ff0000",
    DEMOCRATIC_LV6 : "#6b0000",
    REPUBLICAN_LV1 : "#ababff",
    REPUBLICAN_LV2 : "#7e7eff",
    REPUBLICAN_LV3 : "#6767ff",
    REPUBLICAN_LV4 : "#2828ff",
    REPUBLICAN_LV5 : "#0000ff",
    REPUBLICAN_LV6 : "#000077",
    POPULATION_LV1 : "#b8ffb8",
    POPULATION_LV2 : "#7eff7e",
    POPULATION_LV3 : "#33e533",
    POPULATION_LV4 : "#22b422",
    POPULATION_LV5 : "#087e08",
    POPULATION_LV6 : "#004900",
}

export const GeoDataType = {
    STATE: "state",
    DISTRICT: "district",
    PRECINCT: "precinct",
}

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

export const StateTypeList = [
    StateType.NEWYORK,
    StateType.GEORGIA,
    StateType.ILLINOIS,
]

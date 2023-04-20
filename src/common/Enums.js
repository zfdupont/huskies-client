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

export const GeoDataType = {
    STATE: "state",
    DISTRICT: "district",
    PRECINCT: "precinct",
}

// In this way, geoData will be easily get by stateType and GeoDataType.
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

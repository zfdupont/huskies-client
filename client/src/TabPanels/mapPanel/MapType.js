import StateGeoJson from "../../0.data/states.json";
import NY from "../../0.data/NY.json";
import NYD from "../../0.data/NYD.json";
import {StateType} from "../../common/Store";
import GA from "../../0.data/GA.json";
import GAD from "../../0.data/GAD.json"
import IL from "../../0.data/IL.json";
import ILD from "../../0.data/ILD.json";

// LayerType string must match the layer name in MapProperty.json.
export const TileLayerType = {
    PLACE_LABEL: "placeLabel",
    DEFAULT_WHITE: "defaultWhite",
}

export const LayerGroupType = {
    STATE_DEFAULT: "stateDefault",
    COUNTRY_DEFAULT: "countryDefault",
}
export const GeoData = {
    COUNTRY: StateGeoJson,
    NEWYORK_STATE: NY,
    GEORGIA_STATE: GA,
    ILLINOIS_STATE: IL,
    NEWYORK_DISTRICT: NYD,
    GEORGIA_DISTRICT: GAD,
    ILLINOIS_DISTRICT: ILD,
}

export const StateTypeList = [
    StateType.NEWYORK,
    StateType.GEORGIA,
    StateType.ILLINOIS,
]


let geoJsonHelper = {};

// Return a new GeoJSON object with a filtered feature list; the input is not mutated.
geoJsonHelper.getFilteredGeoJsonByIDs = (districtJson, ids) => ({
    ...districtJson,
    features: districtJson.features.filter((feature) => ids.includes(feature.properties.district_id)),
});

geoJsonHelper.getFilteredGeoJsonById = (districtJson, id) => ({
    ...districtJson,
    features: districtJson.features.filter((feature) => id === feature.properties.district_id),
});

export default geoJsonHelper;
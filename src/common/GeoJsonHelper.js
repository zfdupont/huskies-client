
let geoJsonHelper = {};

geoJsonHelper.getFilteredGeoJsonByIDs = (districtJson, ids) => {
    let filteredJson = districtJson;
    filteredJson.features = districtJson.features.filter((feature) => {
        return ids.includes(feature.properties.district_id);
    });
    return filteredJson;
};

geoJsonHelper.getFilteredGeoJsonById = (districtJson, id) => {
    let filteredJson = districtJson;
    filteredJson.features = districtJson.features.filter((feature) => {
        return id === feature.properties.district_id;
    });
    return filteredJson;
};

export default geoJsonHelper;
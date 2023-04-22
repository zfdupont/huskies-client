
let geoJsonHelper = {};

geoJsonHelper.getFilteredGeoJsonByIDs = (districtJson, ids) => {
    let filteredJson = districtJson;
    filteredJson.features = districtJson.features.filter((feature) => {
        return ids.includes(feature.properties.district_id + 1);
    });
    return filteredJson;
};

export default geoJsonHelper;

let geoJsonHelper = {};

geoJsonHelper.getDistrictJsonByIDs = (districtJson, ids) => {
    let filteredJson = districtJson;
    filteredJson.features = districtJson.features.filter((feature) => {
        return ids.includes(feature.properties.ID);
    });
    return filteredJson;
};

export default geoJsonHelper;
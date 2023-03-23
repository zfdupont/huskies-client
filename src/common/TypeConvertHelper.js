

// --- JSON TO MODEL ---------------------------------
import CountryModel from "../models/CountryModel";
import StateModel from "../models/StateModel";
import DistrictModel from "../models/DistrictModel";
import DemographicModel from "../models/DemographicModel";

export function createCountryModel(countryJsonData)
{
    console.log(countryJsonData)
    let plan = countryJsonData.plan;
    let stateModels = {};
    for (const stateKey in countryJsonData.data)
        stateModels[stateKey] = createStateModel(countryJsonData.data[stateKey]);
    return new CountryModel(plan, stateModels);
}
export function createStateModel(stateJsonData)
{
    let name = stateJsonData.name;
    let districtModels = {};
    for (const districtKey in stateJsonData.districts)
        districtModels[districtKey] = createDistrictModel(stateJsonData.districts[districtKey])
    return new StateModel(name, districtModels);
}
export function createDistrictModel(districtJsonData)
{
    return new DistrictModel(
        districtJsonData.id,
        districtJsonData.party,
        createDemographicModel(districtJsonData.population, districtJsonData.votes)
    )
}
export function createDemographicModel(populationJsonData, votesJsonData)
{
    return new DemographicModel(populationJsonData,votesJsonData)
}
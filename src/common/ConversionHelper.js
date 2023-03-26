import {LayerGroupType, FilterType} from "./Enums";
import CountryModel from "../models/CountryModel";
import StateModel from "../models/StateModel";
import DistrictModel from "../models/DistrictModel";
import DemographicModel from "../models/DemographicModel";


export function filterToLayerGroup(filterType){
    switch(filterType)
    {
        case FilterType.DEMOCRAT: return LayerGroupType.DEMOCRAT;
        case FilterType.REPUBLICAN: return LayerGroupType.REPUBLICAN;
        case FilterType.INCUMBENT: return LayerGroupType.INCUMBENT;
        case FilterType.DIFFERENCE: return LayerGroupType.DIFFERENCE;
    }
}

export function filterToStyle(filterType){
    switch(filterType)
    {
        case FilterType.DEMOCRAT: return "demStyle";
        case FilterType.REPUBLICAN: return "repStyle";
        case FilterType.INCUMBENT: return "incStyle";
        case FilterType.DIFFERENCE: return "diffStyle";
    }
}

export function createCountryModel(countryJsonData)
{
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


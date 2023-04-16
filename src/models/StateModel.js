import {CandidateType, FilterType, PartyType} from "../common/Enums";

export default class StateModel
{
    constructor(planType, stateType, modelData) {
        this.planType = planType
        this.stateType = stateType;
        this.electionDataDict = this.getElectionData(modelData)
        this.compareDataDict = this.getCompareData(modelData)
    }

    getElectionData(modelData)
    {
        let dict = {}
        for (let key in modelData)
        {
            let data = modelData[key]
            dict[key] = {
                districtId : parseInt(key) + 1,
                democraticCandidate : data["DemocraticCandidate"],
                republicanCandidate : data["RepublicanCandidate"],
                winnerCandidate : (data["2020VBIDEN"] > data["2020VTRUMP"])? data["DemocraticCandidate"] : data["RepublicanCandidate"],
                loserCandidate : (data["2020VBIDEN"] < data["2020VTRUMP"])? data["DemocraticCandidate"] : data["RepublicanCandidate"],
                hasIncumbent : (data["Incumbent"] !== "NONE"),
                incumbent : data["Incumbent"],
                winnerParty : (data["2020VBIDEN"] > data["2020VTRUMP"])? PartyType.DEMOCRATIC : PartyType.REPUBLICAN,
                loserParty : (data["2020VBIDEN"] < data["2020VTRUMP"])? PartyType.DEMOCRATIC : PartyType.REPUBLICAN,
                incumbentParty : data["IncumbentParty"],
                democraticVotes : data["2020VBIDEN"],
                republicanVotes : data["2020VTRUMP"],
                winnerVotes : (data["2020VBIDEN"] > data["2020VTRUMP"])? data["2020VBIDEN"] : data["2020VTRUMP"],
                loserVotes : (data["2020VBIDEN"] < data["2020VTRUMP"])? data["2020VBIDEN"] : data["2020VTRUMP"],
                totalPopulation : data["POPTOT"],
                totalVotes : data["VAPTOTAL"],
            }
        }
        return dict;
    }

    getCompareData(modelData)
    {
        let dict = {}
        for (let key in modelData)
        {
            dict[key] = {
                districtId : key,
                area : modelData[key]["ALAND20_added"] / (modelData[key]["ALAND20_common"] + modelData[key]["ALAND20_lost"]),
                democrats : modelData[key]["DEMOCRATS_added"] / (modelData[key]["DEMOCRATS_common"] + modelData[key]["DEMOCRATS_lost"]),
                republicans : modelData[key]["REPUBLICAN_added"] / (modelData[key]["REPUBLICAN_common"] + modelData[key]["REPUBLICAN_lost"]),
                white : modelData[key]["VAPWHITE_added"] / (modelData[key]["VAPWHITE_common"] + modelData[key]["VAPWHITE_lost"]),
                black : modelData[key]["VAPBLACK_added"] / (modelData[key]["VAPBLACK_common"] + modelData[key]["VAPBLACK_lost"]),
                asian : modelData[key]["VAPASIAN_added"] / (modelData[key]["VAPASIAN_common"] + modelData[key]["VAPASIAN_lost"]),
            }
        }
        return dict;
    }

    getFilteredDistrictsID(filterType)
    {
        switch(filterType)
        {
            case FilterType.DEMOCRAT: return this.getDemocratDistrictIDs();
            case FilterType.REPUBLICAN: return this.getRepublicanDistrictIDs();
            case FilterType.INCUMBENT: return this.getIncumbentDistrictIDs();
        }
    }

    getDemocratDistrictIDs()
    {
        let ids = [];
        for (let key in this.electionDataDict) {
            if (this.electionDataDict[key].winnerParty === PartyType.DEMOCRATIC)
                ids.push(this.electionDataDict[key].districtId);
        }
        return ids;
    }

    getRepublicanDistrictIDs()
    {
        let ids = [];
        for (let key in this.electionDataDict) {
            if (this.electionDataDict[key].winnerParty === PartyType.REPUBLICAN)
                ids.push(this.electionDataDict[key].districtId);
        }
        return ids;
    }

    getIncumbentDistrictIDs()
    {
        let ids = [];
        for (let key in this.electionDataDict) {
            if (this.electionDataDict[key].hasIncumbent)
                ids.push(this.electionDataDict[key].districtId);
        }
        return ids;
    }
}
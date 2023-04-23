import {MapFilterType, PartyType} from "../common/GlobalVariables";

export default class StateModel
{
    constructor(planType, stateType, modelData) {
        this.planType = planType
        this.stateType = stateType;
        this.electionDataDict = this.getElectionData(modelData)
        this.compareDataDict = this.getCompareData(modelData)
        this.summaryData = this.getSummaryData(modelData)
    }

    getElectionData(modelData)
    {
        let dict = {}
        for (let key in modelData)
        {
            let data = modelData[key]
            dict[key] = {
                districtId : key,
                democraticCandidate : data["DemocraticCandidate"],
                republicanCandidate : data["RepublicanCandidate"],
                winnerCandidate : (data["2020VBIDEN"] > data["2020VTRUMP"])? data["DemocraticCandidate"] : data["RepublicanCandidate"],
                loserCandidate : (data["2020VBIDEN"] < data["2020VTRUMP"])? data["DemocraticCandidate"] : data["RepublicanCandidate"],
                hasIncumbent : (data["Incumbent"] !== "None"),
                incumbent : data["Incumbent"],
                winnerParty : (data["2020VBIDEN"] > data["2020VTRUMP"])? PartyType.DEMOCRATIC : PartyType.REPUBLICAN,
                loserParty : (data["2020VBIDEN"] < data["2020VTRUMP"])? PartyType.DEMOCRATIC : PartyType.REPUBLICAN,
                incumbentParty : data["IncumbentParty"],
                democraticVotes : data["2020VBIDEN"],
                republicanVotes : data["2020VTRUMP"],
                demVoteMargin : data["2020VBIDEN"] - data["2020VTRUMP"],
                whiteVotes : data["VAPWHITE"],
                blackVotes : data["VAPBLACK"],
                asianVotes : data["VAPASIAN"],
                winnerVotes : (data["2020VBIDEN"] > data["2020VTRUMP"])? data["2020VBIDEN"] : data["2020VTRUMP"],
                loserVotes : (data["2020VBIDEN"] < data["2020VTRUMP"])? data["2020VBIDEN"] : data["2020VTRUMP"],
                totalPopulation : data["POPTOT"],
                totalVotes : data["VAPTOTAL"],
            }

            dict[key].getPopulationByType = (filter) => {
                if (filter === MapFilterType.WHITE) return dict[key].whiteVotes;
                if (filter === MapFilterType.BLACK) return dict[key].blackVotes;
                if (filter === MapFilterType.ASIAN) return dict[key].asianVotes;
                return 0;
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
                area : (modelData[key]["ALAND20_added"] / (modelData[key]["ALAND20_common"] + modelData[key]["ALAND20_lost"])).toFixed(3),
                democrats : (modelData[key]["VAPDEMOCRATS_added"] / (modelData[key]["VAPDEMOCRATS_common"] + modelData[key]["VAPDEMOCRATS_lost"])).toFixed(3),
                republicans : (modelData[key]["VAPREPUBLICAN_added"] / (modelData[key]["VAPREPUBLICAN_common"] + modelData[key]["VAPREPUBLICAN_lost"])).toFixed(3),
                population : (modelData[key]["VAPTOTAL_added"] / (modelData[key]["VAPTOTAL_common"] + modelData[key]["VAPTOTAL_lost"])).toFixed(3),
                white : (modelData[key]["VAPWHITE_added"] / (modelData[key]["VAPWHITE_common"] + modelData[key]["VAPWHITE_lost"])).toFixed(3),
                black : (modelData[key]["VAPBLACK_added"] / (modelData[key]["VAPBLACK_common"] + modelData[key]["VAPBLACK_lost"])).toFixed(3),
                asian : (modelData[key]["VAPASIAN_added"] / (modelData[key]["VAPASIAN_common"] + modelData[key]["VAPASIAN_lost"])).toFixed(3),
            }
        }
        return dict;
    }

    getSummaryData(modelData)
    {
        let minDemVoteMargin = Number.MAX_SAFE_INTEGER;
        let minWhite = Number.MAX_SAFE_INTEGER;
        let minBlack = Number.MAX_SAFE_INTEGER;
        let minAsian = Number.MAX_SAFE_INTEGER;

        let maxDemVoteMargin = Number.MIN_SAFE_INTEGER;
        let maxWhite = Number.MIN_SAFE_INTEGER;
        let maxBlack = Number.MIN_SAFE_INTEGER;
        let maxAsian = Number.MIN_SAFE_INTEGER;

        for (let key in modelData)
        {
            if (key === "10") continue;
            minDemVoteMargin = Math.min(modelData[key]["2020VBIDEN"] - modelData[key]["2020VTRUMP"], minDemVoteMargin);
            minWhite = Math.min(modelData[key]["VAPWHITE"], minWhite);
            minBlack = Math.min(modelData[key]["VAPBLACK"], minBlack);
            minAsian = Math.min(modelData[key]["VAPASIAN"], minAsian);
            maxDemVoteMargin = Math.max(modelData[key]["2020VBIDEN"] - modelData[key]["2020VTRUMP"], maxDemVoteMargin);
            maxWhite = Math.max(modelData[key]["VAPWHITE"], maxWhite);
            maxBlack = Math.max(modelData[key]["VAPBLACK"], maxBlack);
            maxAsian = Math.max(modelData[key]["VAPASIAN"], maxAsian);
        }
        let result =  {
            minDemVoteMargin: minDemVoteMargin,
            minWhite: minWhite,
            minBlack: minBlack,
            minAsian: minAsian,
            maxDemVoteMargin: maxDemVoteMargin,
            maxWhite: maxWhite,
            maxBlack: maxBlack,
            maxAsian: maxAsian,
        }

        result.getMinPopulationByType = (filter) => {
            if (filter === MapFilterType.WHITE) return minWhite;
            if (filter === MapFilterType.BLACK) return minBlack;
            if (filter === MapFilterType.ASIAN) return minAsian;
            return 0;
        }

        result.getMaxPopulationByType = (filter) => {
            if (filter === MapFilterType.WHITE) return maxWhite;
            if (filter === MapFilterType.BLACK) return maxBlack;
            if (filter === MapFilterType.ASIAN) return maxAsian;
            return 0;
        }
        return result;
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
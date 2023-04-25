import {MapFilterType, PartyType, PopulationType} from "../common/GlobalVariables";
import {calculateHeatMapFeatureValues} from "../common/CalculationHelper";

export default class StateModel {
    constructor(planType, stateType, geojsonStateProperties) {
        this.planType = planType
        this.stateType = stateType;
        this.electionDataDict = this.getElectionData(geojsonStateProperties)
        this.compareDataDict = this.getCompareData(geojsonStateProperties)
        this.heatMapData = this.getHeatMapData(geojsonStateProperties)
    }

    getElectionData(geojsonStateProperties) {
        let electionDataDict = {}
        for (let districtId in geojsonStateProperties) {
            let data = geojsonStateProperties[districtId]
            let electionData = {
                districtId : districtId,
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
                winVotePercent: 0,
                loseVotePercent: 0,
                totalPopulation : data["POPTOT"],
                totalVotes : data["VAPTOTAL"],
            };

            electionData.winVotePercent =  Math.ceil((electionData.winnerVotes  / (electionData.winnerVotes + electionData.loserVotes)) * 100 );
            electionData.loseVotePercent =  100 - Math.ceil((electionData.winnerVotes  / (electionData.winnerVotes + electionData.loserVotes)) * 100 );

            electionData.getPopulationByType = (filter) => {
                if (filter === MapFilterType.WHITE) return electionData.whiteVotes;
                if (filter === MapFilterType.BLACK) return electionData.blackVotes;
                if (filter === MapFilterType.ASIAN) return electionData.asianVotes;
                return 0;
            }
            electionDataDict[districtId] = electionData;
        }
        return electionDataDict;
    }

    getCompareData(geojsonStateProperties) {
        let dict = {}
        for (let key in geojsonStateProperties) {
            let data = geojsonStateProperties[key];
            dict[key] = {
                districtId : key,
                area : (data["ALAND20_added"] / (data["ALAND20_common"] + data["ALAND20_lost"])).toFixed(3),
                democrats : (data["VAPDEMOCRATS_added"] / (data["VAPDEMOCRATS_common"] + data["VAPDEMOCRATS_lost"])).toFixed(3),
                republicans : (data["VAPREPUBLICAN_added"] / (data["VAPREPUBLICAN_common"] + data["VAPREPUBLICAN_lost"])).toFixed(3),
                population : (data["VAPTOTAL_added"] / (data["VAPTOTAL_common"] + data["VAPTOTAL_lost"])).toFixed(3),
                white : (data["VAPWHITE_added"] / (data["VAPWHITE_common"] + data["VAPWHITE_lost"])).toFixed(3),
                black : (data["VAPBLACK_added"] / (data["VAPBLACK_common"] + data["VAPBLACK_lost"])).toFixed(3),
                asian : (data["VAPASIAN_added"] / (data["VAPASIAN_common"] + data["VAPASIAN_lost"])).toFixed(3),
            }
        }
        return dict;
    }

    getHeatMapData(geojsonStateProperties) {
        let result = {
            minDemVoteMargin: Number.MAX_SAFE_INTEGER,
            minWhite: Number.MAX_SAFE_INTEGER,
            minBlack: Number.MAX_SAFE_INTEGER,
            minAsian: Number.MAX_SAFE_INTEGER,
            maxDemVoteMargin: Number.MIN_SAFE_INTEGER,
            maxWhite: Number.MIN_SAFE_INTEGER,
            maxBlack: Number.MIN_SAFE_INTEGER,
            maxAsian: Number.MIN_SAFE_INTEGER,
            whiteFeatureValues: [],
            blackFeatureValues: [],
            asianFeatureValues: [],
            democraticFeatureValues: [],
            republicanFeatureValues: [],
            victoryMarginFeatureValues: [3, 5, 10, 20, 50, 100],
        }

        for (let key in geojsonStateProperties) {
            if (key === "10") continue; // TO DO: remove if error of the data district 10 is fixed.
            let data = geojsonStateProperties[key];
            result.minDemVoteMargin = Math.min(data["2020VBIDEN"] - data["2020VTRUMP"], result.minDemVoteMargin);
            result.minWhite = Math.min(data["VAPWHITE"], result.minWhite);
            result.minBlack = Math.min(data["VAPBLACK"], result.minBlack);
            result.minAsian = Math.min(data["VAPASIAN"], result.minAsian);
            result.maxDemVoteMargin = Math.max(data["2020VBIDEN"] - data["2020VTRUMP"], result.maxDemVoteMargin);
            result.maxWhite = Math.max(data["VAPWHITE"], result.maxWhite);
            result.maxBlack = Math.max(data["VAPBLACK"], result.maxBlack);
            result.maxAsian = Math.max(data["VAPASIAN"], result.maxAsian);
        }

        result.whiteFeatureValues = calculateHeatMapFeatureValues(result.minWhite, result.maxWhite);
        result.blackFeatureValues = calculateHeatMapFeatureValues(result.minBlack, result.maxBlack);
        result.asianFeatureValues = calculateHeatMapFeatureValues(result.minAsian, result.maxAsian);

        result.getFeatureValuesByPopulationType = (filter) => {
            if (filter === PopulationType.WHITE) return result.whiteFeatureValues;
            if (filter === PopulationType.BLACK) return result.blackFeatureValues;
            if (filter === PopulationType.ASIAN) return result.asianFeatureValues;
            return null;
        }
        return result;
    }

    getIncumbentDistrictIDs() {
        let ids = [];
        for (let key in this.electionDataDict) {
            if (this.electionDataDict[key].hasIncumbent)
                ids.push(this.electionDataDict[key].districtId);
        }
        return ids;
    }

    getNotIncumbentDistrictIDs() {
        let ids = [];
        for (let key in this.electionDataDict) {
            if (!this.electionDataDict[key].hasIncumbent)
                ids.push(this.electionDataDict[key].districtId);
        }
        return ids;
    }
}
import {MapFilterType, PartyType, PopulationType} from "../common/GlobalVariables";
import {calculateHeatMapFeatureValues} from "../common/CalculationHelper";

export default class StateModel {
    constructor(planType, stateType, geojsonStateProperties) {
        this.planType = planType
        this.stateType = stateType;
        this.electionDataDict = this.getElectionData(geojsonStateProperties);
        this.compareDataDict = this.getCompareData(geojsonStateProperties);
        this.heatMapData = this.getHeatMapData(geojsonStateProperties);
        this.summaryData = this.getSummaryData(geojsonStateProperties);
    }

    getElectionData(geojsonStateProperties) {
        let electionDataDict = {}
        for (let districtId in geojsonStateProperties) {
            let data = geojsonStateProperties[districtId]
            let electionData = {
                districtId : districtId,
                democraticCandidate : data["democrat_candidate"],
                republicanCandidate : data["republican_candidate"],
                winnerCandidate : (data["democrat_votes"] > data["republican_votes"])? data["democrat_candidate"] : data["republican_candidate"],
                loserCandidate : (data["democrat_votes"] < data["republican_votes"])? data["democrat_candidate"] : data["republican_candidate"],
                hasIncumbent : (data["incumbent"] !== null),
                incumbent : data["incumbent"],
                winnerParty : (data["democrat_votes"] > data["republican_votes"])? PartyType.DEMOCRATIC : PartyType.REPUBLICAN,
                loserParty : (data["democrat_votes"] < data["republican_votes"])? PartyType.DEMOCRATIC : PartyType.REPUBLICAN,
                democraticVotes : data["democrat_votes"],
                republicanVotes : data["republican_votes"],
                demVoteMargin : data["democrat_votes"] - data["republican_votes"],
                whiteVotes : data["vap_white"],
                blackVotes : data["vap_black"],
                hispanicVotes : data["vap_hisp"],
                winnerVotes : (data["democrat_votes"] > data["republican_votes"])? data["democrat_votes"] : data["republican_votes"],
                loserVotes : (data["democrat_votes"] < data["republican_votes"])? data["democrat_votes"] : data["republican_votes"],
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
                if (filter === MapFilterType.HISPANIC) return electionData.hispanicVotes;
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
                area : parseFloat(data.area_variation).toFixed(3),
                democrats : parseFloat(data.democrat_variation).toFixed(3),
                republicans : parseFloat(data.republican_variation).toFixed(3),
                population : parseFloat(data.vap_total_variation).toFixed(3),
                white : parseFloat(data.vap_white_variation).toFixed(3),
                black : parseFloat(data.vap_black_variation).toFixed(3),
                hispanic : parseFloat(data.vap_hisp_variation).toFixed(3),
            }
        }
        return dict;
    }

    getHeatMapData(geojsonStateProperties) {
        let result = {
            minDemVoteMargin: Number.MAX_SAFE_INTEGER,
            minWhite: Number.MAX_SAFE_INTEGER,
            minBlack: Number.MAX_SAFE_INTEGER,
            minHispanic: Number.MAX_SAFE_INTEGER,
            maxDemVoteMargin: Number.MIN_SAFE_INTEGER,
            maxWhite: Number.MIN_SAFE_INTEGER,
            maxBlack: Number.MIN_SAFE_INTEGER,
            maxHispanic: Number.MIN_SAFE_INTEGER,
            whiteFeatureValues: [],
            blackFeatureValues: [],
            hispanicVotesFeatureValues: [],
            democraticFeatureValues: [],
            republicanFeatureValues: [],
            victoryMarginFeatureValues: [3, 5, 10, 20, 50, 100],
        }

        for (let key in geojsonStateProperties) {
            if (key === "10") continue; // TO DO: remove if error of the data district 10 is fixed.
            let data = geojsonStateProperties[key];
            result.minDemVoteMargin = Math.min(data["democrat_votes"] - data["republican_votes"], result.minDemVoteMargin);
            result.minWhite = Math.min(data["vap_white"], result.minWhite);
            result.minBlack = Math.min(data["vap_black"], result.minBlack);
            result.minHispanic = Math.min(data["vap_hisp"], result.minHispanic);
            result.maxDemVoteMargin = Math.max(data["democrat_votes"] - data["republican_votes"], result.maxDemVoteMargin);
            result.maxWhite = Math.max(data["vap_white"], result.maxWhite);
            result.maxBlack = Math.max(data["vap_black"], result.maxBlack);
            result.maxHispanic = Math.max(data["vap_hisp"], result.maxHispanic);
        }

        result.whiteFeatureValues = calculateHeatMapFeatureValues(result.minWhite, result.maxWhite);
        result.blackFeatureValues = calculateHeatMapFeatureValues(result.minBlack, result.maxBlack);
        result.hispanicFeatureValues = calculateHeatMapFeatureValues(result.minHispanic, result.maxHispanic);

        result.getFeatureValuesByPopulationType = (filter) => {
            if (filter === PopulationType.WHITE) return result.whiteFeatureValues;
            if (filter === PopulationType.BLACK) return result.blackFeatureValues;
            if (filter === PopulationType.HISPANIC) return result.hispanicFeatureValues;
            return null;
        }
        return result;
    }

    getSummaryData(geojsonStateProperties) {
        let summaryData = {
            numOfDistrics: 0,
            numOfIncumbents: 0,
            numOfDemocratWinners: this.getNumberOfDemocratWinner(),
            numOfRepublicanWinners: this.getNumberOfRepublicanWinner(),
        }
        summaryData.numOfDistrics = Object.keys(geojsonStateProperties).length;
        summaryData.numOfIncumbents = this.getIncumbentDistrictIDs().length;
        return summaryData;
    }

    getNumberOfDemocratWinner() {
        let count = 0;
        for (let key in this.electionDataDict) {
            if (this.electionDataDict[key].winnerParty === PartyType.DEMOCRATIC)
                count += 1;
        }
        return count;
    }

    getNumberOfRepublicanWinner() {
        let count = 0;
        for (let key in this.electionDataDict) {
            if (this.electionDataDict[key].winnerParty === PartyType.REPUBLICAN)
                count += 1;
        }
        return count;
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
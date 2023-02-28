import {FilterType} from "../common/Enums";

export default class StateModel
{
    constructor(name, districts) {
        this.name = name;
        this.districts = districts; // {key : <DistrictModel>}
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
        for (let districtKey in this.districts) {
            if (this.districts[districtKey].party === "democrat") ids.push(this.districts[districtKey].id);
        }
        return ids;
    }

    getRepublicanDistrictIDs()
    {
        let ids = [];
        for (let districtKey in this.districts) {
            if (this.districts[districtKey].party === "republican") ids.push(this.districts[districtKey].id);
        }
        return ids;
    }

    getIncumbentDistrictIDs()
    {
        let ids = [];
        for (let districtKey in this.districts) {
            ids.push(this.districts[districtKey].id); // TO DO: filter only incumbent district.
        }
        return ids;
    }
}
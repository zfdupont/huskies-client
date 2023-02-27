export default class StateModel
{
    constructor(name, districts) {
        this.name = name;
        this.districts = districts;
    }

    getDemocratDistricts()
    {
        return this.districts.filter((district) => district.party === "democrat");
    }

    getRepublicanDistricts()
    {
        return this.districts.filter((district) => district.party === "republican");
    }
}
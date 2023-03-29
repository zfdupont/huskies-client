export default class DistrictModel
{
    constructor(id, democratsCandidate, republicanCandidate, incumbent, party, votes, populations) {
        this.id = id;
        this.democratsCandidate = democratsCandidate;
        this.republicanCandidate = republicanCandidate;
        this.incumbent = incumbent;
        this.party = party;
        this.votes = votes;
        this.populations = populations;
    }
}
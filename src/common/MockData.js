

export default function MockData(plan="2020") {
    const generateDistricts = (numDistricts, name) => {
        const getRandomNumber = (max) => Math.floor(Math.random() * max) + 1;
        const districtObj = {};
        for(let i = 1; i <= numDistricts; ++i){
            let blueVotes = getRandomNumber(100000);
            let redVotes = getRandomNumber(100000);
            let totalVotes = blueVotes + redVotes;

            let whitePop = getRandomNumber(500000)
            let blackPop = getRandomNumber(100000)
            let asianPop = getRandomNumber(100000)
            let nativePop = getRandomNumber(10000)
            let pacificPop = getRandomNumber(10000)
            let totalPop = whitePop + blackPop + asianPop + nativePop + pacificPop;
            districtObj[i.toString()] = {
                "id": i,
                "name": name,
                "democratsCandidate": "NameCand1",
                "republicanCandidate": "NameCand2",
                "incumbent": "NameCand1",
                "party": (blueVotes > redVotes ? "democrat" : "republican"),
                "votes": {
                    "total": totalVotes,
                    "democrats": blueVotes,
                    "republicans": redVotes
                },
                "population": {
                    "total": totalPop,
                    "white": whitePop,
                    "black": blackPop,
                    "asian": asianPop,
                    "native": nativePop,
                    "pacific": pacificPop
                }
            }
        }
        return districtObj;
    }
    return {
        plan: plan,
        data: {
            "NY": {name:'newyork', districts: generateDistricts(26, "newyork")},
            "GA": {name:'Georgia', districts: generateDistricts(17, "georgia")},
            "IL": {name:'Illinois', districts: generateDistricts(14, "illinois")}
        }
    }    
}
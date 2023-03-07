package com.huskies.server.candidate;

import com.huskies.server.precinct.Precinct;
import com.huskies.server.precinct.PrecinctRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {
    @Autowired CandidateRepository candidateRepo;
    @Autowired PrecinctRepository precinctRepo;

    public Candidate upsertCandidate(String name, boolean incumbent, int votes, char party){
        Candidate c = candidateRepo.findByName(name).orElse(new Candidate(name, party));
        c.setVotes(c.getVotes() + votes);
        c.setIncumbent(incumbent);
        candidateRepo.save(c);
        return c;
    }

    public Candidate findCandidate(long id){
        return candidateRepo.findById(id).orElseThrow();
    }
    public Candidate findCandidate(String name) {
        List<Candidate> list = new ArrayList<>(1);
        for (Candidate candidate : candidateRepo.findAll()) {
            if (name.equalsIgnoreCase(candidate.getName())) {
                list.add(candidate);
                break;
            }
        }
        return Optional.of(list.get(0)).orElseThrow();
    }

    public Precinct addCandidateToPrecinct(String precinctId, long candidateId){
        Precinct p = precinctRepo.findById(precinctId).orElseThrow();
        Candidate c = candidateRepo.findById(candidateId).orElseThrow();
        p.getCandidates().add(c);
        c.getPrecinct().add(p);
        p.setTotalVotes(p.getTotalVotes() + c.getVotes());
        precinctRepo.save(p);
        candidateRepo.save(c);
        return p;
    }
}

package com.huskies.server.candidate;

import com.huskies.server.districtPlan.DistrictPlan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateRepository extends CrudRepository<Candidate, Long> {
    default Optional<Candidate> findByName(String name){
        for (Candidate candidate : findAll()) {
            if(name.equalsIgnoreCase(candidate.getName())) return Optional.of(candidate);
        }
        return Optional.empty();
    }
}

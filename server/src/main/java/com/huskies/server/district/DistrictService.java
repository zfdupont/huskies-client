package com.huskies.server.district;

import com.huskies.server.candidate.Candidate;
import com.huskies.server.precinct.Precinct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DistrictService {
    @Autowired DistrictRepository districtRepo;

    public Map<String, Integer> getVotes(String districtId){
//        District district = districtRepo.findById(districtId).orElseThrow();
//        Set<Precinct> precincts = district.getPrecincts();
//        Map<String, Integer> votes = new HashMap<>();
//        for( Precinct p : precincts){
//            int totalVotes = votes.getOrDefault("total", 0);
//            String red = p.getCandidates().stream().findFirst(Candidate c -> {
//
//            })
//            votes.put("total", totalVotes+p.getTotalVotes());
//            votes.put("red_votes")
//        }
        return new HashMap<>();
    }

    public List<Candidate> getCandidates(String districtId){
        List<Candidate> list = new ArrayList<>();
        District district = districtRepo.findById(districtId).orElseThrow();
        Set<Precinct> precincts = district.getPrecincts();
        for( Precinct p : precincts ){
            list.addAll(p.getCandidates());
        }
        return list;
    }
}

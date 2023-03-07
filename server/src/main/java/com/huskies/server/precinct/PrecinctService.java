package com.huskies.server.precinct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PrecinctService {
    @Autowired PrecinctRepository precinctRepo;

    public void addDemographics(String precinctId, Map<String, Integer> demographics){
        Precinct p = precinctRepo.findById(precinctId).orElseThrow();
        p.setDemographics(demographics);
    }


    public void update(Precinct precinct){
        precinctRepo.save(precinct);
    }
}

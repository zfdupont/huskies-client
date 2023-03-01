package com.huskies.server.precinct;

import com.huskies.server.districtPlan.DistrictPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class PrecinctService {
    @Autowired PrecinctRepository precinctRepo;

    public Precinct getPrecinctById(String id){
        return precinctRepo.findById(id).get();
    }

    public void update(Precinct precinct){
        precinctRepo.save(precinct);
    }
}
